# Quem me deve

Aplicação web para anotar quem te deve dinheiro: cadastre devedores, registre dívidas parceladas e acompanhe o que já foi pago e o que ainda está em aberto.

Modelo de negócio freemium: o plano **Gratuito** permite até 3 devedores; o plano **Pro** aumenta esse limite mediante assinatura. Cobrança ainda não está integrada — os planos hoje são apenas cadastrais (ver [Planos e regras de negócio](#planos-e-regras-de-negócio)).

## Stack tecnológica

| Camada | Tecnologia |
|---|---|
| Backend | Laravel 12 (PHP 8.4) |
| Frontend | React 19 + TypeScript, via Inertia.js 2 (sem API REST separada) |
| UI | Tailwind CSS 4 + shadcn/ui (Radix primitives) |
| Banco de dados | MySQL 8 |
| Build | Vite 6 |
| Infra local | Docker Compose (app + mysql) |

O frontend não é uma SPA consumindo API — é Inertia.js: cada rota do Laravel renderiza um componente React (`resources/js/pages/**`) recebendo props tipadas do controller, sem endpoints JSON expostos publicamente.

## Como rodar o projeto

Pré-requisito: Docker Desktop.

```bash
docker compose up -d --build
```

O `entrypoint.sh` do container `app` espera o MySQL ficar disponível, roda `php artisan migrate --force` e `php artisan db:seed --force` automaticamente a cada subida (idempotente — não duplica dados).

Acesse **http://localhost:8000**.

Usuário de teste (criado pelo seeder): `test@example.com` / `password`.

### Variáveis de ambiente

Definidas diretamente no `docker-compose.yml` (serviço `app`). Para rodar fora do Docker, copie `.env.example` para `.env` e ajuste `DB_HOST`/`DB_PORT` para seu MySQL local.

## Modelo de dados

Fonte da verdade do schema: [`schema.sql`](schema.sql). As migrations em `database/migrations/` replicam esse schema exatamente (tipos `INT UNSIGNED`, `DATETIME` com `CURRENT_TIMESTAMP`, `ENUM`, etc. — não os tipos "padrão" do Laravel como `BIGINT`/`TIMESTAMP`).

```
plans 1───* users 1───* devedores 1───* dividas 1───* parcelas
                              └──────────────────────┘
                         (dividas também referencia users diretamente)
```

- **plans** — `gratuito` (3 devedores) e `pro` (ilimitado hoje; preço ainda não cobrado de fato).
- **users** — autenticação. Note que a coluna de senha se chama `password_hash`, não `password` (ver [Autenticação](#autenticação)).
- **devedores** — pessoas que devem dinheiro ao usuário. `slug` é único por usuário (`user_id` + `slug`), gerado automaticamente a partir do nome.
- **dividas** — uma dívida de um devedor, com valor total e quantidade de parcelas. Status `aberta`/`quitada`.
- **parcelas** — parcelas individuais de uma dívida. Status `pendente`/`paga`.

`dividas` e `parcelas` já têm migration e Model prontos, mas **ainda não têm CRUD implementado** (ver [Status do projeto](#status-do-projeto)).

## Autenticação

O scaffolding de auth (login, registro, esqueci senha, configurações de perfil) é o padrão do starter kit Laravel + React, com um ajuste: o `schema.sql` define a coluna de senha como `password_hash`, não `password`. Para não precisar reescrever todos os controllers de autenticação, o [`User` model](app/Models/User.php) faz a ponte:

```php
protected function password(): Attribute
{
    return Attribute::make(
        get: fn () => $this->attributes['password_hash'] ?? null,
        set: fn (string $value) => ['password_hash' => $value],
    );
}

public function getAuthPassword(): string
{
    return $this->attributes['password_hash'];
}
```

Assim, `Auth::attempt()`, `Hash::make()` nos controllers e o cast `'hashed'` continuam funcionando normalmente, mas o dado é persistido em `password_hash`.

**Verificação de e-mail foi removida** — o schema não tem coluna `email_verified_at` e essa funcionalidade não está no escopo atual. As rotas e controllers de verificação foram removidos de `routes/auth.php`.

## Arquitetura

O CRUD de **Devedores** segue Repository Pattern + Service Layer + Policies, pensado para ser o padrão replicado quando os CRUDs de Dívidas e Parcelas forem implementados.

```
Controller  → só orquestra HTTP (chama Service, autoriza via Policy, retorna Inertia::render)
Service     → regras de negócio (geração de slug único, limite de devedores do plano)
Repository  → acesso a dados (Eloquent), escondido atrás de uma interface
Policy      → autorização por posse (um usuário só mexe nos próprios devedores)
FormRequest → validação de entrada
Resource    → formato de saída (serialização) estável para o frontend
```

```
app/
├── Http/
│   ├── Controllers/DevedorController.php      # fino, sem lógica de negócio
│   ├── Requests/Devedor/                       # StoreDevedorRequest, UpdateDevedorRequest
│   └── Resources/DevedorResource.php
├── Services/DevedorService.php                 # slug único + limite do plano
├── Repositories/
│   ├── Contracts/
│   │   ├── RepositoryInterface.php             # contrato genérico (find/create/update/delete)
│   │   └── DevedorRepositoryInterface.php       # + paginateForUser, slugExistsForUser...
│   ├── BaseRepository.php                       # implementação genérica reaproveitável
│   └── EloquentDevedorRepository.php
├── Policies/DevedorPolicy.php                   # view/update/delete = dono do registro
└── Providers/RepositoryServiceProvider.php      # liga interface → implementação (DIP)
```

Por que interface + binding em vez de usar o Eloquent direto no Service: troca de implementação (ex.: cache, outra fonte de dados, testes com fake repository) sem tocar em Service/Controller. `BaseRepository`/`RepositoryInterface` existem para serem reaproveitados pelos próximos CRUDs (Divida, Parcela) sem duplicar `create`/`update`/`delete`.

### Duas pegadinhas de nomenclatura (PT-BR × inglês)

O pluralizador/singularizador do Laravel (Doctrine Inflector) assume inglês. Isso gerou dois bugs reais durante o desenvolvimento, ambos já corrigidos, mas vale saber ao criar os próximos models/rotas em português:

1. **Nome de tabela**: `Devedor` → Eloquent tentaria a tabela `devedors` (plural em inglês), mas a tabela é `devedores`. Corrigido com `protected $table = 'devedores';` no model.
2. **Parâmetro de rota**: `Route::resource('devedores', ...)` gerava `{devedore}` em vez de `{devedor}` (singularização errada), quebrando o route-model-binding do controller. Corrigido com `->parameters(['devedores' => 'devedor'])`.

`Divida` e `Parcela` coincidem com o plural/singular em inglês por sorte (`dividas`/`divida`, `parcelas`/`parcela`), mas confira sempre com `php artisan route:list` ao criar uma rota nova com nome em português.

## Planos e regras de negócio

- Todo usuário novo entra no plano `gratuito` (`plan_id` default 1 no banco).
- O limite de devedores do plano (`plans.limite_devedores`) é aplicado no [`DevedorService`](app/Services/DevedorService.php): ao tentar cadastrar um devedor além do limite, é lançada uma `ValidationException` — o formulário do frontend recebe o erro normalmente, sem página de erro.
- `limite_devedores = NULL` significa ilimitado (caso do plano Pro hoje).
- **Não há cobrança real implementada.** Os valores de preço na landing page ([`welcome.tsx`](resources/js/pages/welcome.tsx)) são de exemplo e estão isolados num array no topo do arquivo — combinar com os valores reais em `PlanSeeder` quando o modelo de cobrança for definido.

## Identidade visual

Tema roxo/branco configurado via variáveis CSS em [`resources/css/app.css`](resources/css/app.css) (`--primary`, `--ring`, `--sidebar-primary` etc.), aplicado automaticamente a todos os componentes shadcn/ui do projeto. Tema claro é o padrão (`useAppearance` em [`use-appearance.tsx`](resources/js/hooks/use-appearance.tsx)); modo escuro é opt-in via o seletor no header.

## Status do projeto

**Pronto:**
- Autenticação completa (login, registro, esqueci senha, configurações de perfil)
- Landing page (`/`) com seção de planos
- CRUD completo de Devedores (listar com busca/paginação, criar, editar, excluir)

**Não implementado ainda:**
- CRUD de Dívidas (`app/Models/Divida.php` e migration já existem)
- CRUD de Parcelas (`app/Models/Parcela.php` e migration já existem)
- Cobrança/checkout dos planos pagos
- Dashboard com dados reais (hoje é o placeholder do starter kit)

## Testes manuais realizados

Sem browser automatizado disponível no ambiente de desenvolvimento; toda a validação foi feita via `curl` direto contra os endpoints dentro do container Docker (login, CRUD completo de devedor, limite de plano, isolamento entre usuários — dois usuários distintos, um não enxerga nem edita devedores do outro). Recomenda-se validação manual no navegador antes de qualquer deploy.
