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
- **dividas** — uma dívida de um devedor, com valor total e quantidade de parcelas. Status `aberta`/`quitada`. Ao criar uma dívida, as parcelas são **geradas automaticamente** (ver [Regra de negócio: geração de parcelas](#regra-de-negócio-geração-de-parcelas)).
- **parcelas** — parcelas individuais de uma dívida, geradas pelo `DividaService`. Status `pendente`/`paga`.

`parcelas` já tem migration e Model prontos, mas **ainda não tem CRUD/tela própria** — hoje só é possível ver o progresso (quantas pagas/total) na listagem de dívidas (ver [Status do projeto](#status-do-projeto)).

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

Os CRUDs de **Devedores** e **Dívidas** seguem o mesmo padrão: Repository Pattern + Service Layer + Policies. É o padrão a replicar quando o CRUD de Parcelas for implementado.

```
Controller  → só orquestra HTTP (chama Service, autoriza via Policy, retorna Inertia::render)
Service     → regras de negócio (slug único, limite do plano, geração de parcelas...)
Repository  → acesso a dados (Eloquent), escondido atrás de uma interface
Policy      → autorização por posse (um usuário só mexe nos próprios registros)
FormRequest → validação de entrada (inclui checar que registros relacionados pertencem ao usuário)
Resource    → formato de saída (serialização) estável para o frontend
```

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── DevedorController.php               # fino, sem lógica de negócio
│   │   └── DividaController.php
│   ├── Requests/
│   │   ├── Devedor/                             # StoreDevedorRequest, UpdateDevedorRequest
│   │   └── Divida/                              # StoreDividaRequest, UpdateDividaRequest
│   └── Resources/
│       ├── DevedorResource.php
│       └── DividaResource.php                   # inclui devedor{id,nome} e contagem de parcelas
├── Services/
│   ├── DevedorService.php                       # slug único + limite do plano
│   └── DividaService.php                        # gera as parcelas dentro de uma transaction
├── Repositories/
│   ├── Contracts/
│   │   ├── RepositoryInterface.php              # contrato genérico (find/create/update/delete)
│   │   ├── DevedorRepositoryInterface.php        # + paginateForUser, slugExistsForUser...
│   │   ├── DividaRepositoryInterface.php         # + paginateForUser (com filtro de status)
│   │   └── ParcelaRepositoryInterface.php        # + createMany (bulk insert)
│   ├── BaseRepository.php                        # implementação genérica reaproveitável
│   ├── EloquentDevedorRepository.php
│   ├── EloquentDividaRepository.php
│   └── EloquentParcelaRepository.php             # só o necessário p/ DividaService gerar parcelas
├── Policies/
│   ├── DevedorPolicy.php                        # view/update/delete = dono do registro
│   └── DividaPolicy.php
└── Providers/RepositoryServiceProvider.php       # liga interface → implementação (DIP)
```

Por que interface + binding em vez de usar o Eloquent direto no Service: troca de implementação (ex.: cache, outra fonte de dados, testes com fake repository) sem tocar em Service/Controller. `BaseRepository`/`RepositoryInterface` existem para serem reaproveitados pelo próximo CRUD (Parcela) sem duplicar `create`/`update`/`delete`.

`ParcelaRepositoryInterface` existe hoje só com o necessário para o `DividaService` inserir as parcelas em lote — não há Controller/Policy/tela de Parcela ainda porque não há CRUD de Parcela implementado.

### Flash estruturado (não só mensagens de texto)

O padrão `->with('success', 'mensagem')` já existente foi estendido para também carregar **dados**, não só texto — usado para o popup descrito em [Fluxos de UX](#fluxos-de-ux). `HandleInertiaRequests::share()` expõe `flash.devedorCriado` (além de `flash.success`/`flash.error`) lendo da sessão:

```php
'flash' => [
    'success' => $request->session()->get('success'),
    'error' => $request->session()->get('error'),
    'devedorCriado' => $request->session()->get('devedorCriado'),
],
```

Como é sessão flash "normal" do Laravel, o dado só sobrevive até a próxima requisição — não precisa de lógica extra para "limpar" o popup depois de mostrado uma vez.

### Regra de negócio: geração de parcelas

Ao criar uma dívida, `DividaService::createForUser()` cria o registro e gera as parcelas numa única `DB::transaction()` (se algo falhar, nada é persistido):

- **Divisão do valor**: feita em centavos (inteiros) para evitar erro de ponto flutuante. `valor_total` é dividido por `qtd_parcelas`; o resto da divisão é distribuído 1 centavo a mais nas primeiras parcelas, garantindo que a soma das parcelas bata exatamente com `valor_total` (ex.: R$ 1.000,00 em 3x → R$ 333,34 + R$ 333,33 + R$ 333,33).
- **Vencimentos**: mensais a partir de `data_primeira_parcela`, usando `addMonthsNoOverflow` (evita o bug clássico de "31 de janeiro + 1 mês = 3 de março").
- **Imutabilidade**: depois de criada, uma dívida só permite editar `devedor_id`, `descricao` e `status` — `valor_total`, `qtd_parcelas` e `data_primeira_parcela` não podem mudar, porque as parcelas já foram geradas a partir desses valores. Isso é reforçado tanto no `UpdateDividaRequest` (nem valida esses campos) quanto no `DividaService::updateForUser()` (filtra os campos aceitos).
- **Status manual**: como ainda não existe CRUD de Parcela para marcar parcelas individuais como pagas, o campo `status` da dívida (`aberta`/`quitada`) é editável manualmente na tela de edição como forma provisória de sinalizar quitação.

### "Vencida" é um status derivado, não uma coluna

`dividas.status` só tem `aberta`/`quitada` no schema — não existe `vencida` no banco. Uma dívida é considerada vencida quando está `aberta` **e** tem pelo menos uma parcela `pendente` com `vencimento` no passado. Isso é calculado em duas camadas:

- **Filtro** (`EloquentDividaRepository::paginateForUser`): quando `status=vencida` é passado, a query vira `where('status', 'aberta')->whereHas('parcelas', ...)` em vez de um `where('status', ...)` literal — é tratado como caso especial antes do filtro normal.
- **Exibição** (`DividaResource`): expõe um campo calculado `vencida: boolean` (`status === 'aberta' && parcelas_vencidas_count > 0`), usando um `withCount` com a mesma condição do filtro. O frontend usa esse campo para trocar o badge de "Aberta" (roxo) para "Vencida" (vermelho) na listagem — o filtro sozinho não seria muito útil se a tabela não deixasse claro *por que* uma dívida apareceu nele.

Repare que o filtro e a exibição compartilham a mesma condição (`status='pendente' AND vencimento < hoje`) via um método privado `scopeVencidas()` no repository — evita a query da listagem dizer uma coisa e o badge mostrar outra.

### Duas pegadinhas de nomenclatura (PT-BR × inglês)

O pluralizador/singularizador do Laravel (Doctrine Inflector) assume inglês. Isso gerou dois bugs reais durante o desenvolvimento do CRUD de Devedores, ambos corrigidos e agora aplicados preventivamente em todo model/rota nova:

1. **Nome de tabela**: `Devedor` → Eloquent tentaria a tabela `devedors` (plural em inglês), mas a tabela é `devedores`. Corrigido com `protected $table = 'devedores';` no model. Todo model novo em português deve declarar `$table` explicitamente, mesmo que pareça "óbvio" (ex.: `Divida`/`Parcela` coincidem com o inglês por sorte, mas não vale a pena confiar nisso).
2. **Parâmetro de rota**: `Route::resource('devedores', ...)` gerava `{devedore}` em vez de `{devedor}` (singularização errada), quebrando o route-model-binding do controller. Corrigido com `->parameters(['devedores' => 'devedor'])` — aplicado também em `dividas` (`->parameters(['dividas' => 'divida'])`) desde o início, e confirmado com `php artisan route:list --path=<recurso>` antes de dar como pronto.

## Planos e regras de negócio

- Todo usuário novo entra no plano `gratuito` (`plan_id` default 1 no banco).
- O limite de devedores do plano (`plans.limite_devedores`) é aplicado no [`DevedorService`](app/Services/DevedorService.php): ao tentar cadastrar um devedor além do limite, é lançada uma `ValidationException` — o formulário do frontend recebe o erro normalmente, sem página de erro.
- `limite_devedores = NULL` significa ilimitado (caso do plano Pro hoje).
- **Não há cobrança real implementada.** Os valores de preço na landing page ([`welcome.tsx`](resources/js/pages/welcome.tsx)) são de exemplo e estão isolados num array no topo do arquivo — combinar com os valores reais em `PlanSeeder` quando o modelo de cobrança for definido.

## Fluxos de UX

### Popup "cadastrar dívida" após criar um devedor

Depois de cadastrar um devedor, [`devedores/index.tsx`](resources/js/pages/devedores/index.tsx) abre automaticamente um `Dialog` perguntando se o usuário quer já registrar uma dívida para essa pessoa:

1. `DevedorController::store()` cria o devedor e flasheia `{ id, nome }` em `devedorCriado` junto com a mensagem de sucesso.
2. Na listagem, o componente inicializa um `useState` a partir de `flash.devedorCriado` — se vier preenchido, o `Dialog` já abre.
3. **"Cadastrar dívida"** → `Link` para `/dividas/create?devedor_id={id}`; `DividaController::create()` lê `devedor_id` da query string e devolve como `devedorSelecionadoId`, que o formulário usa para pré-selecionar o devedor no `Select`.
4. **"Agora não"** → só fecha o modal, sem navegar.

Como o popup depende de estado local inicializado a partir da prop de flash (não de um `useEffect` reagindo a toda re-render), ele não reabre sozinho em buscas/paginação na mesma página — só aparece uma vez, logo após o redirect do cadastro.

## Identidade visual

Tema roxo/branco configurado via variáveis CSS em [`resources/css/app.css`](resources/css/app.css) (`--primary`, `--ring`, `--sidebar-primary` etc.), aplicado automaticamente a todos os componentes shadcn/ui do projeto. Tema claro é o padrão (`useAppearance` em [`use-appearance.tsx`](resources/js/hooks/use-appearance.tsx)); modo escuro é opt-in via o seletor no header.

## Status do projeto

**Pronto:**
- Autenticação completa (login, registro, esqueci senha, configurações de perfil)
- Landing page (`/`) com seção de planos
- CRUD completo de Devedores (listar com busca/paginação, criar, editar, excluir), com popup pós-cadastro oferecendo criar uma dívida na hora
- CRUD completo de Dívidas (listar com busca/filtro de status/paginação, criar com geração automática de parcelas, editar descrição/devedor/status, excluir com cascade das parcelas)

**Não implementado ainda:**
- CRUD de Parcelas — hoje as parcelas só existem "por baixo" (geradas na criação da dívida); não há tela para listar/marcar parcelas individuais como pagas (`app/Models/Parcela.php`, migration e `ParcelaRepositoryInterface` mínimo já existem)
- Cobrança/checkout dos planos pagos
- Dashboard com dados reais (hoje é o placeholder do starter kit)

## Testes manuais realizados

Sem browser automatizado disponível no ambiente de desenvolvimento; toda a validação foi feita via `curl` direto contra os endpoints dentro do container Docker:
- Login, CRUD completo de devedor, limite de plano, isolamento entre usuários (dois usuários distintos, um não enxerga nem edita devedores do outro).
- CRUD completo de dívida: criação gera as parcelas certas (valor dividido exatamente, vencimentos mensais corretos — conferido direto no banco), edição, exclusão em cascata das parcelas, e validação de que não é possível criar uma dívida usando o `devedor_id` de outro usuário (422).
- Popup pós-cadastro de devedor: `flash.devedorCriado` chega certo na primeira requisição após o cadastro e some na seguinte (confirmado com duas requisições sucessivas), e a pré-seleção do devedor em `/dividas/create?devedor_id=X` funciona.

Recomenda-se validação manual no navegador antes de qualquer deploy.
