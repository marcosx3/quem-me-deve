SET NAMES utf8mb4;
SET time_zone = '-03:00';

CREATE TABLE IF NOT EXISTS plans (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(30) NOT NULL,
    nome VARCHAR(60) NOT NULL,
    preco_centavos INT UNSIGNED NOT NULL DEFAULT 0,
    limite_devedores INT UNSIGNED NULL,
    limite_dividas INT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_plans_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO plans (id, slug, nome, preco_centavos, limite_devedores, limite_dividas) VALUES
    (1, 'gratuito', 'Gratuito', 0, 3, 6),
    (2, 'pro', 'Pro', 1499, 10, 20),
    (3, 'premium', 'Premium', 8990, NULL, NULL)
ON DUPLICATE KEY UPDATE slug = slug;

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(190) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(30) NULL,
    plan_id INT UNSIGNED NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_users_email (email),
    KEY idx_users_plan (plan_id),
    CONSTRAINT fk_users_plan FOREIGN KEY (plan_id) REFERENCES plans (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS devedores (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    nome VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL,
    telefone VARCHAR(30) NULL,
    observacoes VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_devedores_user_slug (user_id, slug),
    CONSTRAINT fk_devedores_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS dividas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    devedor_id INT UNSIGNED NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    qtd_parcelas SMALLINT UNSIGNED NOT NULL,
    data_primeira_parcela DATE NOT NULL,
    status ENUM('aberta', 'quitada') NOT NULL DEFAULT 'aberta',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_dividas_user (user_id),
    KEY idx_dividas_devedor (devedor_id),
    CONSTRAINT fk_dividas_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_dividas_devedor FOREIGN KEY (devedor_id) REFERENCES devedores (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS parcelas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    divida_id INT UNSIGNED NOT NULL,
    numero SMALLINT UNSIGNED NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    vencimento DATE NOT NULL,
    status ENUM('pendente', 'paga') NOT NULL DEFAULT 'pendente',
    pago_em DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_parcelas_divida_numero (divida_id, numero),
    KEY idx_parcelas_divida (divida_id),
    CONSTRAINT fk_parcelas_divida FOREIGN KEY (divida_id) REFERENCES dividas (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
