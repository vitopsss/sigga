import { CheckCircle2, KeyRound, LockKeyhole, ShieldCheck, Users } from "lucide-react";

import { Header } from "@/components/dashboard/header";
import { Badge, Card } from "@/components/ui";

export const dynamic = "force-dynamic";

const accessProfiles = [
  {
    name: "Administração",
    badge: "Gestão",
    description: "Perfil para diretoria, financeiro/administrativo ou ponto focal responsável pela gestão do ambiente.",
    permissions: [
      "Gerenciar usuários e perfis de acesso",
      "Consultar todos os dados do SIGGATER",
      "Acessar métricas, relatórios-base e exportações operacionais",
      "Acompanhar homologação, suporte e configurações de implantação",
    ],
  },
  {
    name: "Coordenação / Gerência",
    badge: "Coordenação",
    description: "Perfil para coordenação do projeto e análise do acompanhamento técnico.",
    permissions: [
      "Consultar UFPAs, organizações coletivas, diagnósticos e atendimentos",
      "Acompanhar métricas por território, organização e situação de atendimento",
      "Analisar relatórios enviados pelos agentes",
      "Marcar relatório como em análise, aprovado, reprovado ou enviado ao SGA",
    ],
  },
  {
    name: "Técnicos (Campo)",
    badge: "Técnico",
    description: "Perfil para técnicos responsáveis pelo acompanhamento das UFPAs e registro de campo.",
    permissions: [
      "Cadastrar e atualizar UFPAs dentro do fluxo autorizado",
      "Registrar integrantes, diagnósticos, indicadores e visitas técnicas",
      "Salvar rascunhos e enviar atendimentos para análise",
      "Gerar PDF individual por visita quando aplicável",
    ],
  },
];

const moduleAccess = [
  { module: "Métricas", admin: true, manager: true, operator: false },
  { module: "UFPAs", admin: true, manager: true, operator: true },
  { module: "Organizações coletivas", admin: true, manager: true, operator: true },
  { module: "Atendimentos", admin: true, manager: true, operator: true },
  { module: "Técnicos", admin: true, manager: true, operator: false },
  { module: "Acessos", admin: true, manager: false, operator: false },
];

const blockedModules = [
  "Borderôs",
  "Financeiro",
  "Recursos Humanos",
  "Compras e contratos",
  "Patrimônio",
  "Projetos",
];

function AccessMark({ enabled }: { enabled: boolean }) {
  return enabled ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
      <CheckCircle2 className="h-3.5 w-3.5" />
      Sim
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
      Não
    </span>
  );
}

export default function AcessosSiggaterPage() {
  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Header
        title="Acessos"
        description="Perfis operacionais do SIGGATER Web para administração, coordenação e equipe de campo"
      />

      <div className="p-6 lg:p-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm lg:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <Badge variant="success">Base de implantação</Badge>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                      Controle de acesso por perfil
                    </h2>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Este painel organiza os perfis que serão usados para liberar o SIGGATER ao Instituto. O ambiente também
                  pode operar em modo SIGGATER isolado, bloqueando por rota os módulos que não fazem parte da Fase 1.
                  A criação de contas reais deve ocorrer após a definição dos usuários-chave, ambiente em nuvem e política de senha.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <div className="flex items-center gap-2 font-medium text-slate-900">
                  <LockKeyhole className="h-4 w-4 text-emerald-700" />
                  Próximo passo operacional
                </div>
                <p className="mt-2 max-w-sm">
                  Receber nome, e-mail e perfil de cada pessoa para emitir os acessos iniciais do ambiente.
                </p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {accessProfiles.map((profile) => (
              <Card key={profile.name} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      {profile.badge}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-950">{profile.name}</h3>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{profile.description}</p>
                <ul className="mt-5 space-y-3">
                  {profile.permissions.map((permission) => (
                    <li key={permission} className="flex gap-3 text-sm leading-5 text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                      <span>{permission}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">Matriz resumida de acesso</h2>
                  <p className="text-sm text-slate-500">
                    Visão objetiva do que cada perfil deve acessar na Fase 1.
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left">
                    <th className="px-6 py-4 font-medium text-slate-600">Módulo</th>
                    <th className="px-6 py-4 font-medium text-slate-600">Administração</th>
                    <th className="px-6 py-4 font-medium text-slate-600">Coordenação</th>
                    <th className="px-6 py-4 font-medium text-slate-600">Operação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {moduleAccess.map((item) => (
                    <tr key={item.module} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{item.module}</td>
                      <td className="px-6 py-4"><AccessMark enabled={item.admin} /></td>
                      <td className="px-6 py-4"><AccessMark enabled={item.manager} /></td>
                      <td className="px-6 py-4"><AccessMark enabled={item.operator} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
                    <LockKeyhole className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">Módulos bloqueados no modo SIGGATER</h2>
                    <p className="text-sm text-slate-500">
                      Esses módulos não aparecem no menu e também ficam inacessíveis por URL direta quando o escopo SIGGATER está ativo.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex max-w-xl flex-wrap gap-2">
                {blockedModules.map((module) => (
                  <span
                    key={module}
                    className="rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700"
                  >
                    {module}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
