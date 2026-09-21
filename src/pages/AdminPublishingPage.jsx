import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AdminLoginScreen from '../components/AdminLoginScreen.jsx';
import { categorias as staticCategories, recursos as staticTools } from '../data/recursos.js';
import {
  adminJourneyStatusOptions,
  buildClientWhatsAppHandoffUrl,
  buildClientProjectPipeline,
  clientJourneyDecisionOptions,
  clientJourneyStatusLevels,
  getClientCommercialPriority,
  groupBriefingResponsesByClient,
} from '../utils/adminLeads.js';
import { getAdminNewsStatusLabel, isPublishedStatus, sortAdminNewsItems } from '../utils/adminPublishing.js';

const localAuthKey = 'vant_admin_local_auth';
const localNewsItemsKey = 'vant_admin_news_items';
const localNewsStatusesKey = 'vant_admin_news_statuses';
const localToolsKey = 'vant_admin_tools';
const localNewsletterIssuesKey = 'vant_admin_newsletter_issues';

const newsStatuses = [
  { value: 'rascunho', label: 'Rascunho' },
  { value: 'aguardando_avaliacao', label: 'Em revisao' },
  { value: 'aprovada', label: 'Publicada' },
  { value: 'reprovada', label: 'Arquivada' },
];

const adminPriorityOptions = [
  { value: '', label: 'Automatica' },
  { value: 'high', label: 'Alta prioridade' },
  { value: 'medium', label: 'Prioridade media' },
  { value: 'low', label: 'Baixa prioridade' },
];

const affiliateStatuses = [
  { value: 'nao_verificado', label: 'Nao verificado' },
  { value: 'programa_existe', label: 'Programa existe' },
  { value: 'com_link_configurado', label: 'Link configurado' },
  { value: 'sem_programa', label: 'Sem programa' },
];

const emptyNewsForm = {
  id: '',
  titlePt: '',
  title: '',
  link: '',
  source: '',
  category: 'IA',
  summaryPt: '',
  summary: '',
  status: 'rascunho',
};

const emptyNewsletterForm = {
  subject: 'Curadoria VANT Business',
  intro: '',
  type: 'curadoria',
  status: 'agendada',
  scheduledAt: '',
};

const emptyToolForm = {
  id: '',
  name: '',
  description: '',
  link: '',
  utm: '?utm_source=vant&utm_content=recursos',
  categoria: 'IA',
  badge: '',
  gratis: false,
  logo: '',
  emoji: 'IA',
  affiliateStatus: 'nao_verificado',
  affiliateUrl: '',
  status: 'rascunho',
};

function isLocalPreview() {
  return ['localhost', '127.0.0.1'].includes(window.location.hostname);
}

function hasLocalAuth() {
  return window.localStorage.getItem(localAuthKey) === 'true';
}

function readJson(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function slugify(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function formatDate(date) {
  if (!date) return 'Sem data';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'Sem data';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
}

function normalizeNewsForm(form, status = form.status) {
  const titlePt = form.titlePt || form.title || 'Noticia sem titulo';
  const nextStatus = status || 'rascunho';
  return {
    ...form,
    id: form.id || slugify(titlePt),
    title: form.title || titlePt,
    titlePt,
    category: form.category || 'IA',
    source: form.source || '',
    summary: form.summary || form.summaryPt || '',
    summaryPt: form.summaryPt || form.summary || '',
    publishedAt: form.publishedAt || (nextStatus === 'aprovada' ? new Date().toISOString() : null),
    status: nextStatus,
  };
}

function normalizeToolForm(form, status = form.status) {
  const name = form.name || 'Ferramenta sem nome';
  return {
    ...form,
    id: form.id || slugify(name),
    name,
    categoria: form.categoria || 'IA',
    badge: form.badge || null,
    gratis: Boolean(form.gratis),
    utm: form.utm || '?utm_source=vant&utm_content=recursos',
    emoji: form.emoji || 'IA',
    affiliateStatus: form.affiliateStatus || 'nao_verificado',
    affiliateUrl: form.affiliateUrl || '',
    status: status || 'rascunho',
  };
}

function mergeById(primary = [], overrides = []) {
  const map = new Map(primary.map((item) => [item.id, item]));
  overrides.forEach((item) => map.set(item.id, { ...(map.get(item.id) || {}), ...item }));
  return [...map.values()];
}

function isPublished(status) {
  return isPublishedStatus(status);
}

function statusTone(status) {
  if (isPublished(status)) return 'emerald';
  if (status === 'reprovada') return 'rose';
  if (status === 'aguardando_avaliacao') return 'amber';
  return 'slate';
}

function StatusPill({ children, tone = 'slate' }) {
  const tones = {
    slate: 'border-white/10 bg-white/[0.04] text-slate-300',
    cyan: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-200',
    amber: 'border-amber-300/20 bg-amber-300/10 text-amber-100',
    emerald: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100',
    rose: 'border-rose-300/20 bg-rose-300/10 text-rose-100',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone] || tones.slate}`}>
      {children}
    </span>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
    />
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className="min-h-28 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
    />
  );
}

function SelectInput(props) {
  return (
    <select
      {...props}
      className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
    />
  );
}

function AdminTabs({ active, onChange }) {
  const tabs = [
    { id: 'clicks', label: 'Cliques' },
    { id: 'leads', label: 'Leads' },
    { id: 'news', label: 'Noticias' },
    { id: 'tools', label: 'Ferramentas' },
  ];

  return (
    <nav className="grid gap-2 sm:grid-cols-4" aria-label="Areas do admin">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
            active === tab.id
              ? 'border-cyan-400/40 bg-cyan-400/10 text-white'
              : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/25 hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

function LeadsPanel({ leads, onRefresh, localMode = false, onMessage }) {
  const clients = useMemo(() => groupBriefingResponsesByClient(leads), [leads]);
  const pipeline = useMemo(() => buildClientProjectPipeline(clients), [clients]);
  const [selectedKey, setSelectedKey] = useState('');
  const [activeLane, setActiveLane] = useState('all');
  const [savingLead, setSavingLead] = useState(false);
  const [editingLead, setEditingLead] = useState(false);
  const [leadForm, setLeadForm] = useState({ adminJourneyStatus: '', adminPriority: '', adminNote: '', adminNextAction: '' });
  const totalResponses = clients.reduce((total, client) => total + client.responses.length, 0);
  const visibleClients = activeLane === 'all'
    ? clients
    : clients.filter((client) => client.journey?.lane === activeLane);
  const selectedClient = clients.find((client) => client.key === selectedKey) || clients[0] || null;
  const selectedLead = selectedClient?.responses?.[0] || null;
  const selectedMetadata = selectedLead?.metadata || {};
  const selectedPriority = selectedClient ? getClientCommercialPriority(selectedClient) : null;
  const selectedWhatsAppUrl = selectedClient ? buildClientWhatsAppHandoffUrl(selectedClient) : '';
  const visualJourneyLane = ['remarketing', 'client'].includes(selectedClient?.journey?.lane)
    ? 'proposal'
    : selectedClient?.journey?.lane;
  const visualJourneyIndex = clientJourneyStatusLevels.findIndex((level) => level.id === visualJourneyLane);
  const visualJourneyWidth = visualJourneyIndex >= 0
    ? `${(visualJourneyIndex / (clientJourneyStatusLevels.length - 1)) * 100}%`
    : '0%';

  useEffect(() => {
    setLeadForm({
      adminJourneyStatus: selectedMetadata.adminJourneyStatus || selectedClient?.journey?.lane || '',
      adminPriority: selectedMetadata.adminPriority || '',
      adminNote: selectedMetadata.adminNote || '',
      adminNextAction: selectedMetadata.adminNextAction || '',
    });
  }, [selectedClient?.key, selectedMetadata.adminJourneyStatus, selectedMetadata.adminPriority, selectedMetadata.adminNote, selectedMetadata.adminNextAction]);

  useEffect(() => {
    setEditingLead(false);
  }, [selectedClient?.key]);

  async function saveLeadPatch(patch = {}) {
    if (!selectedLead?.id) return;
    if (localMode) {
      onMessage?.('Edicao de status exige API/Supabase; no modo local esta acao nao salva.');
      return;
    }

    setSavingLead(true);
    try {
      const response = await fetch('/api/admin-leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: selectedLead.id, ...patch }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Falha ao atualizar lead');
      await onRefresh?.();
      onMessage?.('Status do projeto atualizado.');
    } catch (error) {
      onMessage?.(error.message);
    } finally {
      setSavingLead(false);
    }
  }

  async function deleteSelectedClient() {
    if (!selectedClient) return;
    if (localMode) {
      onMessage?.('Exclusao exige API/Supabase; no modo local esta acao nao salva.');
      return;
    }

    const confirmed = window.confirm(`Excluir ${selectedClient.responses.length} resposta(s) deste projeto?`);
    if (!confirmed) return;

    setSavingLead(true);
    try {
      const response = await fetch('/api/admin-leads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ids: selectedClient.responses.map((lead) => lead.id) }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Falha ao excluir lead');
      setSelectedKey('');
      await onRefresh?.();
      onMessage?.('Projeto excluido do painel.');
    } catch (error) {
      onMessage?.(error.message);
    } finally {
      setSavingLead(false);
    }
  }

  function changeSelectedClientStatus(nextStatus) {
    const currentStatus = selectedClient?.journey?.lane || 'new';
    if (!nextStatus || nextStatus === currentStatus) return;

    const currentLevel = clientJourneyStatusLevels.find((level) => level.id === currentStatus);
    const nextLevel = clientJourneyStatusLevels.find((level) => level.id === nextStatus);
    const confirmed = window.confirm(`Alterar status de "${currentLevel?.label || currentStatus}" para "${nextLevel?.label || nextStatus}"?`);
    if (!confirmed) return;

    setLeadForm((current) => ({ ...current, adminJourneyStatus: nextStatus }));
    saveLeadPatch({ adminJourneyStatus: nextStatus });
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-cyan-400">Jornada comercial</p>
          <h2 className="mt-2 text-xl font-bold text-white">Projetos recebidos pelo site</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
            Visao ampla dos clientes que preencheram o pre-briefing, com etapa, pendencias e proxima acao para captar, atender, acompanhar e converter melhor.
          </p>
        </div>
        <StatusPill tone="emerald">{totalResponses} respostas</StatusPill>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-3 xl:grid-cols-6">
        <button
          type="button"
          onClick={() => setActiveLane('all')}
          className={`rounded-xl border p-3 text-left transition ${
            activeLane === 'all' ? 'border-cyan-300/40 bg-cyan-300/10' : 'border-white/10 bg-slate-950/45 hover:border-white/25'
          }`}
        >
          <span className="text-xs font-semibold text-white">Todos</span>
          <span className="mt-1 block text-xl font-bold text-white">{clients.length}</span>
        </button>
        {pipeline.map((lane) => (
          <button
            key={lane.id}
            type="button"
            onClick={() => setActiveLane(lane.id)}
            className={`rounded-xl border p-3 text-left transition ${
              activeLane === lane.id ? 'border-cyan-300/40 bg-cyan-300/10' : 'border-white/10 bg-slate-950/45 hover:border-white/25'
            }`}
          >
            <span className="text-xs font-semibold text-white">{lane.label}</span>
            <span className="mt-1 block text-xl font-bold text-white">{lane.clients.length}</span>
          </button>
        ))}
      </div>

      <div className="mt-5">
        {clients.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-500">
            Ainda nao ha pre-briefings comerciais registrados.
          </p>
        ) : (
          <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/45">
              <div className="grid grid-cols-[1.2fr_0.9fr_0.7fr] gap-3 border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                <span>Projeto</span>
                <span>Etapa</span>
                <span className="text-right">Entrada</span>
              </div>
              <div className="divide-y divide-white/10">
                {visibleClients.length === 0 ? (
                  <p className="p-4 text-sm text-slate-500">Nenhum projeto nesta etapa.</p>
                ) : (
                  visibleClients.map((client) => {
                    const lead = client.responses[0] || {};
                    const metadata = lead.metadata || {};
                    const selected = selectedClient?.key === client.key;

                    return (
                      <button
                        key={client.key}
                        type="button"
                        onClick={() => setSelectedKey(client.key)}
                        className={`grid w-full grid-cols-[1.2fr_0.9fr_0.7fr] gap-3 px-4 py-3 text-left transition ${
                          selected ? 'bg-cyan-300/10' : 'hover:bg-white/[0.03]'
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-white">
                            {metadata.businessName || client.name}
                          </span>
                          <span className="mt-1 block truncate text-xs text-slate-500">
                            {metadata.solutionType || lead.product_title || 'Solucao nao informada'}
                          </span>
                        </span>
                        <span className="self-center">
                          <StatusPill tone={client.journey?.tone || 'cyan'}>{client.journey?.label || 'Entrada'}</StatusPill>
                        </span>
                        <span className="self-center text-right text-xs text-slate-500">{formatDate(client.latestAt)}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <aside className="rounded-xl border border-white/10 bg-slate-950/55 p-5">
              {selectedClient ? (
                <div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-widest text-cyan-400">Detalhe do projeto</p>
                      <h3 className="mt-2 text-2xl font-bold text-white">{selectedMetadata.businessName || selectedClient.name}</h3>
                      <p className="mt-1 break-all text-sm text-cyan-300">{selectedClient.email || 'email nao informado'}</p>
                      {selectedClient.whatsapp ? <p className="mt-1 text-xs text-slate-400">{selectedClient.whatsapp}</p> : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedPriority ? <StatusPill tone={selectedPriority.tone}>Prioridade comercial: {selectedPriority.label}</StatusPill> : null}
                      <StatusPill tone={selectedClient.journey?.tone || 'cyan'}>{selectedClient.journey?.label || 'Entrada'}</StatusPill>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.04] p-4">
                    <div className="flex flex-col gap-1">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">Etapa do lead</p>
                        <p className="mt-1 text-sm text-slate-300">{selectedClient.journey?.label || 'Entrada'}</p>
                      </div>
                    </div>
                    <div className="mt-5">
                      <div className="relative px-2 pb-10 pt-2">
                        <div className="absolute left-4 right-4 top-5 h-px bg-white/10" />
                        <div className="absolute left-4 top-5 h-px bg-cyan-300/70" style={{ width: visualJourneyWidth }} />
                        {clientJourneyStatusLevels.map((level) => {
                          const active = visualJourneyLane === level.id;
                          const levelIndex = clientJourneyStatusLevels.findIndex((item) => item.id === level.id);
                          const reached = visualJourneyIndex >= 0 && levelIndex <= visualJourneyIndex;
                          const edgeClass = levelIndex === 0
                            ? 'left-0 items-start text-left'
                            : levelIndex === clientJourneyStatusLevels.length - 1
                              ? 'right-0 items-end text-right'
                              : '-translate-x-1/2 items-center text-center';
                          const edgeStyle = levelIndex === 0 || levelIndex === clientJourneyStatusLevels.length - 1
                            ? {}
                            : { left: `${(levelIndex / (clientJourneyStatusLevels.length - 1)) * 100}%` };

                          return (
                            <button
                              key={level.id}
                              type="button"
                              onClick={() => changeSelectedClientStatus(level.id)}
                              disabled={savingLead || active}
                              aria-pressed={active}
                              className={`absolute top-0 flex w-24 flex-col gap-2 transition ${edgeClass} ${
                                active ? 'text-white' : 'text-slate-500 hover:text-white'
                              } disabled:cursor-default disabled:opacity-100`}
                              style={edgeStyle}
                            >
                              <span className={`flex h-6 w-6 items-center justify-center rounded-full border transition ${
                                active
                                  ? 'border-cyan-200 bg-cyan-300/20'
                                  : reached
                                    ? 'border-cyan-300/40 bg-cyan-300/10'
                                    : 'border-white/15 bg-slate-950'
                              }`}
                              >
                                <span className={`h-2.5 w-2.5 rounded-full ${reached ? 'bg-cyan-200' : 'bg-slate-700'}`} />
                              </span>
                              <span className={`text-[10px] font-semibold uppercase tracking-widest ${active ? 'text-cyan-100' : ''}`}>
                                {level.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {selectedClient.journey?.lane === 'proposal' ? (
                      <div className="mt-4 border-t border-white/10 pt-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Decisao da proposta</p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {clientJourneyDecisionOptions.map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => changeSelectedClientStatus(option.id)}
                              disabled={savingLead}
                              className="rounded-lg border border-white/10 bg-slate-950/55 px-3 py-3 text-left text-slate-300 transition hover:border-cyan-300/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <span className="text-xs font-semibold uppercase tracking-widest">{option.label}</span>
                              <span className="mt-1 block text-xs leading-relaxed text-slate-500">{option.description}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Ações do lead</p>
                        <p className="mt-1 text-sm text-slate-400">Edição avançada fica fechada até ser solicitada.</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingLead((value) => !value)}
                          className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/30"
                        >
                          {editingLead ? 'Fechar edição' : 'Editar'}
                        </button>
                        <button
                          type="button"
                          onClick={deleteSelectedClient}
                          disabled={savingLead}
                          className="rounded-lg border border-rose-300/25 px-3 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-300/10 disabled:opacity-50"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>

                    {editingLead ? (
                      <>
                        <div className="mt-4 grid gap-3 md:grid-cols-[0.8fr_1.2fr]">
                          <label className="block">
                            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Status</span>
                            <select
                              value={leadForm.adminJourneyStatus}
                              onChange={(event) => setLeadForm((current) => ({ ...current, adminJourneyStatus: event.target.value }))}
                              disabled={savingLead}
                              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/50 disabled:opacity-50"
                            >
                              {adminJourneyStatusOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </select>
                          </label>
                          <label className="block">
                            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Prioridade comercial</span>
                            <select
                              value={leadForm.adminPriority}
                              onChange={(event) => setLeadForm((current) => ({ ...current, adminPriority: event.target.value }))}
                              disabled={savingLead}
                              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/50 disabled:opacity-50"
                            >
                              {adminPriorityOptions.map((option) => (
                                <option key={option.value || 'auto'} value={option.value}>{option.label}</option>
                              ))}
                            </select>
                          </label>
                          <label className="block">
                            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Proxima acao</span>
                            <input
                              value={leadForm.adminNextAction}
                              onChange={(event) => setLeadForm((current) => ({ ...current, adminNextAction: event.target.value }))}
                              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/50"
                              placeholder="Ex: enviar proposta ate sexta"
                            />
                          </label>
                          <label className="block md:col-span-2">
                            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Observacao interna</span>
                            <textarea
                              value={leadForm.adminNote}
                              onChange={(event) => setLeadForm((current) => ({ ...current, adminNote: event.target.value }))}
                              className="mt-2 min-h-20 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/50"
                              placeholder="Contexto comercial, combinados ou follow-up."
                            />
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => saveLeadPatch({
                            adminJourneyStatus: leadForm.adminJourneyStatus,
                            adminPriority: leadForm.adminPriority,
                            adminNote: leadForm.adminNote,
                            adminNextAction: leadForm.adminNextAction,
                          })}
                          disabled={savingLead}
                          className="mt-3 rounded-lg bg-cyan-300 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-50"
                        >
                          {savingLead ? 'Salvando...' : 'Salvar edicao'}
                        </button>
                      </>
                    ) : null}
                  </div>

                  <div className="mt-5 grid gap-4 text-sm md:grid-cols-2">
                    <div className="md:col-span-2">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Proxima acao</p>
                      <p className="mt-1 leading-relaxed text-slate-200">{selectedClient.journey?.nextAction}</p>
                      {selectedWhatsAppUrl ? (
                        <a
                          href={selectedWhatsAppUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-xs font-semibold text-emerald-100 transition hover:border-emerald-200/50 hover:bg-emerald-300/15"
                        >
                          Continuar no WhatsApp
                        </a>
                      ) : null}
                    </div>
                    {selectedClient.journey?.missing?.length ? (
                      <div className="md:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Pendencias</p>
                        <p className="mt-1 text-amber-100">{selectedClient.journey.missing.join(', ')}</p>
                      </div>
                    ) : null}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Solucao</p>
                      <p className="mt-1 text-slate-300">{selectedMetadata.solutionType || selectedLead?.product_title || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Momento</p>
                      <p className="mt-1 text-slate-300">{selectedMetadata.projectStage || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Investimento</p>
                      <p className="mt-1 text-slate-300">{selectedMetadata.budgetRange || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Instagram</p>
                      <p className="mt-1 text-slate-300">{selectedMetadata.instagramHandle || '-'}</p>
                    </div>
                    {selectedMetadata.message ? (
                      <div className="md:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Briefing</p>
                        <p className="mt-1 leading-relaxed text-slate-300">{selectedMetadata.message}</p>
                      </div>
                    ) : null}
                    {selectedClient.journey?.note ? (
                      <div className="md:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Observacao interna</p>
                        <p className="mt-1 leading-relaxed text-slate-300">{selectedClient.journey.note}</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

function ClicksPanel({ clicks }) {
  const grouped = useMemo(() => {
    const map = new Map();
    clicks.forEach((click) => {
      const key = `${click.item_type || 'item'}:${click.item_id || 'sem-id'}`;
      const current = map.get(key) || {
        key,
        count: 0,
        title: click.item_title || click.item_id || 'Item sem titulo',
        type: click.item_type || 'item',
        targetUrl: click.target_url || '',
      };
      current.count += 1;
      map.set(key, current);
    });
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 8);
  }, [clicks]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-3">
        <StatCard label="Cliques totais" value={clicks.length} hint="eventos rastreados" />
        <StatCard label="Itens clicados" value={grouped.length} hint="ferramentas, ebooks ou noticias" />
        <StatCard label="Ultimo clique" value={clicks[0] ? formatDate(clicks[0].created_at) : '-'} hint="atividade mais recente" />
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-400">Onde clicaram</p>
            <h2 className="mt-2 text-xl font-bold text-white">Itens com mais cliques</h2>
          </div>
          <StatusPill tone="cyan">{grouped.length} itens</StatusPill>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {grouped.length === 0 ? (
            <p className="rounded-xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-500">
              Ainda nao ha cliques registrados.
            </p>
          ) : (
            grouped.map((item) => (
              <article key={item.key} className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.type}</p>
                  </div>
                  <StatusPill tone="cyan">{item.count}</StatusPill>
                </div>
                {item.targetUrl && <p className="mt-3 truncate text-xs text-slate-500">{item.targetUrl}</p>}
              </article>
            ))
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-xl font-bold text-white">Historico recente</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-widest text-slate-500">
              <tr>
                <th className="py-3 pr-4">Data</th>
                <th className="py-3 pr-4">Item</th>
                <th className="py-3 pr-4">Origem</th>
                <th className="py-3 pr-4">Destino</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-300">
              {clicks.slice(0, 25).map((click) => (
                <tr key={click.id || `${click.item_id}-${click.created_at}`}>
                  <td className="whitespace-nowrap py-3 pr-4 text-slate-500">{formatDate(click.created_at)}</td>
                  <td className="py-3 pr-4">{click.item_title || click.item_id || '-'}</td>
                  <td className="py-3 pr-4 text-slate-500">{click.source || click.path || '-'}</td>
                  <td className="max-w-xs truncate py-3 pr-4 text-slate-500">{click.target_url || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function NewsPanel({
  items,
  form,
  setForm,
  onSave,
  onEdit,
  saving,
  selectedNewsIds,
  onToggleEmailItem,
  newsletterForm,
  setNewsletterForm,
  newsletterIssues,
  onSaveNewsletter,
  onRunNewsAgent,
  runningNewsAgent,
}) {
  const sortedItems = useMemo(() => sortAdminNewsItems(items), [items]);
  const usedInNewsletterIds = useMemo(() => {
    const ids = new Set();
    (newsletterIssues || []).forEach((issue) => {
      (issue.items || []).forEach((item) => ids.add(item.itemId || item.item_id || item.id));
    });
    return ids;
  }, [newsletterIssues]);
  const reviewItems = useMemo(() => sortedItems.filter((item) => !isPublished(item.status) && item.status !== 'reprovada'), [sortedItems]);
  const approvedItems = useMemo(
    () => sortedItems.filter((item) => isPublished(item.status) && !usedInNewsletterIds.has(item.id)),
    [sortedItems, usedInNewsletterIds]
  );
  const selectedItems = approvedItems.filter((item) => selectedNewsIds.includes(item.id)).slice(0, 10);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateNewsletter(field, value) {
    setNewsletterForm((current) => ({ ...current, [field]: value }));
  }

  function renderNewsCard(item, { approved = false } = {}) {
    const selected = selectedNewsIds.includes(item.id);
    const selectClass = selected
      ? 'rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition disabled:cursor-not-allowed disabled:opacity-50'
      : 'rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50';

    return (
      <article key={item.id} className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">{item.titlePt || item.title}</p>
            <p className="mt-1 text-xs text-slate-500">{item.source || 'sem fonte'} · {formatDate(item.publishedAt || item.updatedAt)}</p>
          </div>
          <StatusPill tone={statusTone(item.status)}>{getAdminNewsStatusLabel(item.status)}</StatusPill>
        </div>
        {(item.summaryPt || item.summary) && <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.summaryPt || item.summary}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => onEdit(item)} className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:text-white">
            Editar
          </button>
          {approved ? (
            <button type="button" onClick={() => onToggleEmailItem(item)} className={selectClass}>
              {selected ? 'No email' : 'Incluir no email'}
            </button>
          ) : (
            <button type="button" onClick={() => onSave('aprovada', item)} className="rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-300/15">
              Publicar
            </button>
          )}
          <button type="button" onClick={() => onSave('rascunho', item)} className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:text-white">
            Voltar para rascunho
          </button>
        </div>
      </article>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-5">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-cyan-400">Noticias</p>
              <h2 className="mt-2 text-xl font-bold text-white">Criar ou editar noticia</h2>
              <p className="mt-2 text-sm text-slate-500">Salvar como rascunho nao publica. Publicar move a noticia para Aprovadas e libera no blog.</p>
            </div>
            <button type="button" onClick={onRunNewsAgent} disabled={runningNewsAgent || saving} className="rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-4 py-3 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/15 disabled:opacity-60">
              {runningNewsAgent ? 'Buscando...' : 'Buscar noticias'}
            </button>
          </div>

          <form className="mt-5 space-y-4" onSubmit={(event) => event.preventDefault()}>
            <Field label="Titulo em portugues">
              <TextInput value={form.titlePt} onChange={(event) => update('titlePt', event.target.value)} placeholder="Ex: OpenAI lanca..." />
            </Field>
            <Field label="Link da fonte">
              <TextInput value={form.link} onChange={(event) => update('link', event.target.value)} placeholder="https://..." />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Fonte">
                <TextInput value={form.source} onChange={(event) => update('source', event.target.value)} placeholder="OpenAI, Google, The Verge..." />
              </Field>
              <Field label="Categoria">
                <TextInput value={form.category} onChange={(event) => update('category', event.target.value)} placeholder="IA" />
              </Field>
            </div>
            <Field label="Resumo">
              <TextArea value={form.summaryPt} onChange={(event) => update('summaryPt', event.target.value)} placeholder="Resumo curto para o blog." />
            </Field>
            <Field label="Status">
              <SelectInput value={form.status} onChange={(event) => update('status', event.target.value)}>
                {newsStatuses.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </SelectInput>
            </Field>

            <div className="grid gap-2 sm:grid-cols-3">
              <button type="button" onClick={() => onSave('rascunho')} disabled={saving} className="rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-white/30 disabled:opacity-60">
                Salvar rascunho
              </button>
              <button type="button" onClick={() => onSave('aguardando_avaliacao')} disabled={saving} className="rounded-xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm font-bold text-amber-100 transition hover:bg-amber-300/15 disabled:opacity-60">
                Revisar depois
              </button>
              <button type="button" onClick={() => onSave('aprovada')} disabled={saving} className="rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60">
                Publicar
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-cyan-400">Email programado</p>
              <h2 className="mt-2 text-xl font-bold text-white">Montar curadoria</h2>
              <p className="mt-2 text-sm text-slate-500">Escolha ate 10 noticias na area Aprovadas.</p>
            </div>
            <StatusPill tone={selectedItems.length === 10 ? 'emerald' : 'amber'}>{selectedItems.length}/10 itens</StatusPill>
          </div>

          <div className="mt-5 space-y-4">
            <Field label="Assunto do email">
              <TextInput value={newsletterForm.subject} onChange={(event) => updateNewsletter('subject', event.target.value)} placeholder="Curadoria VANT Business" />
            </Field>
            <Field label="Introducao">
              <TextArea value={newsletterForm.intro} onChange={(event) => updateNewsletter('intro', event.target.value)} placeholder="Texto curto antes da lista." />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tipo">
                <SelectInput value={newsletterForm.type} onChange={(event) => updateNewsletter('type', event.target.value)}>
                  <option value="curadoria">Curadoria</option>
                  <option value="ebook">Ebook</option>
                </SelectInput>
              </Field>
              <Field label="Enviar em">
                <TextInput type="datetime-local" value={newsletterForm.scheduledAt} onChange={(event) => updateNewsletter('scheduledAt', event.target.value)} />
              </Field>
            </div>
            <button type="button" onClick={onSaveNewsletter} disabled={saving || selectedItems.length === 0} className="w-full rounded-xl bg-emerald-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-200 disabled:opacity-60">
              Armazenar selecao para email
            </button>
          </div>

          <div className="mt-5 space-y-2">
            {(newsletterIssues || []).slice(0, 3).map((issue) => (
              <div key={issue.id} className="rounded-xl border border-white/10 bg-slate-950/50 p-3 text-sm text-slate-300">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-white">{issue.subject}</span>
                  <StatusPill tone={issue.status === 'agendada' ? 'emerald' : 'slate'}>{issue.status}</StatusPill>
                </div>
                <p className="mt-1 text-xs text-slate-500">{issue.items?.length || 0} itens · {formatDate(issue.scheduledAt)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="space-y-5">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-cyan-400">Para revisar</p>
              <h2 className="mt-2 text-xl font-bold text-white">Rascunhos e aguardando avaliacao</h2>
            </div>
            <StatusPill tone="amber">{reviewItems.length} itens</StatusPill>
          </div>

          <div className="mt-5 space-y-3">
            {reviewItems.length === 0 ? (
              <p className="rounded-xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-500">Nao ha noticias pendentes de avaliacao.</p>
            ) : (
              reviewItems.map((item) => renderNewsCard(item))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-300">Aprovadas</p>
              <h2 className="mt-2 text-xl font-bold text-white">Publicadas ainda nao usadas no email</h2>
            </div>
            <StatusPill tone="emerald">{approvedItems.length} itens</StatusPill>
          </div>

          <div className="mt-5 space-y-3">
            {approvedItems.length === 0 ? (
              <p className="rounded-xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-500">Nao ha noticias aprovadas pendentes de email.</p>
            ) : (
              approvedItems.map((item) => renderNewsCard(item, { approved: true }))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function ToolsPanel({ items, form, setForm, onSave, onEdit, saving }) {
  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  const categories = [...new Set([...staticCategories.filter((item) => item !== 'Todas'), ...items.map((item) => item.categoria).filter(Boolean)])];

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-cyan-400">Ferramentas de IA</p>
          <h2 className="mt-2 text-xl font-bold text-white">Criar ou editar ferramenta</h2>
          <p className="mt-2 text-sm text-slate-500">Publicar faz a ferramenta aparecer em /recursos.</p>
        </div>

        <form className="mt-5 space-y-4" onSubmit={(event) => event.preventDefault()}>
          <Field label="Nome">
            <TextInput value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Ex: Gamma AI" />
          </Field>
          <Field label="Link">
            <TextInput value={form.link} onChange={(event) => update('link', event.target.value)} placeholder="https://..." />
          </Field>
          <Field label="Descricao">
            <TextArea value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="O que ela faz e por que entra na VANT." />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Categoria">
              <SelectInput value={form.categoria} onChange={(event) => update('categoria', event.target.value)}>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Status afiliado">
              <SelectInput value={form.affiliateStatus} onChange={(event) => update('affiliateStatus', event.target.value)}>
                {affiliateStatuses.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </SelectInput>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Badge">
              <TextInput value={form.badge || ''} onChange={(event) => update('badge', event.target.value)} placeholder="Que uso, Afiliado..." />
            </Field>
            <Field label="Logo">
              <TextInput value={form.logo || ''} onChange={(event) => update('logo', event.target.value)} placeholder="/assets/tools/logo.svg" />
            </Field>
          </div>
          <Field label="Link afiliado">
            <TextInput value={form.affiliateUrl || ''} onChange={(event) => update('affiliateUrl', event.target.value)} placeholder="Opcional" />
          </Field>
          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-300">
            <input type="checkbox" checked={form.gratis} onChange={(event) => update('gratis', event.target.checked)} className="h-4 w-4 accent-cyan-400" />
            Tem plano gratis ou teste gratis
          </label>

          <div className="grid gap-2 sm:grid-cols-3">
            <button type="button" onClick={() => onSave('rascunho')} disabled={saving} className="rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-white/30 disabled:opacity-60">
              Salvar rascunho
            </button>
            <button type="button" onClick={() => onSave('aguardando_avaliacao')} disabled={saving} className="rounded-xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm font-bold text-amber-100 transition hover:bg-amber-300/15 disabled:opacity-60">
              Revisar depois
            </button>
            <button type="button" onClick={() => onSave('publicada')} disabled={saving} className="rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60">
              Publicar
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-400">Catalogo</p>
            <h2 className="mt-2 text-xl font-bold text-white">Ferramentas cadastradas</h2>
          </div>
          <StatusPill tone="cyan">{items.length} itens</StatusPill>
        </div>

        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{item.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.categoria} · {item.affiliateStatus || 'nao_verificado'}</p>
                </div>
                <StatusPill tone={statusTone(item.status)}>{item.status || 'rascunho'}</StatusPill>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => onEdit(item)} className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:text-white">
                  Editar
                </button>
                <button type="button" onClick={() => onSave('publicada', item)} className="rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-300/15">
                  Publicar
                </button>
                <button type="button" onClick={() => onSave('rascunho', item)} className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:text-white">
                  Voltar para rascunho
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function AdminPublishingPage() {
  const location = useLocation();
  const forceLoginView = new URLSearchParams(location.search).get('view') === 'login';
  const [auth, setAuth] = useState(() => {
    if (forceLoginView) return 'login';
    if (isLocalPreview()) return hasLocalAuth() ? 'ok' : 'login';
    return 'login';
  });
  const [data, setData] = useState(null);
  const [newsForm, setNewsForm] = useState(emptyNewsForm);
  const [toolForm, setToolForm] = useState(emptyToolForm);
  const [newsletterForm, setNewsletterForm] = useState(emptyNewsletterForm);
  const [selectedNewsIds, setSelectedNewsIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [runningNewsAgent, setRunningNewsAgent] = useState(false);
  const [message, setMessage] = useState('');

  async function loadLocalData() {
    const response = await fetch('/data/ai-news.json');
    const payload = response.ok ? await response.json() : { items: [] };
    const localNews = readJson(localNewsItemsKey, []);
    const localNewsStatuses = readJson(localNewsStatusesKey, {});
    const staticNews = (payload.items || []).map((item) => ({
      ...item,
      status: localNewsStatuses[item.id] || item.status || 'aguardando_avaliacao',
    }));
    const tools = mergeById(
      staticTools.map((tool) => normalizeToolForm({ ...tool, status: 'publicada' }, 'publicada')),
      readJson(localToolsKey, [])
    );

    setData({
      ok: true,
      localPreview: true,
      clicks: [],
      subscribers: [],
      newsItems: mergeById(staticNews, localNews),
      tools,
      newsletterIssues: readJson(localNewsletterIssuesKey, []),
      warnings: ['Modo local: rascunhos ficam no navegador. No preview da Vercel, a publicacao usa API/Supabase.'],
    });
    setAuth('ok');
    return true;
  }

  async function loadData() {
    try {
      const response = await fetch('/api/admin-data', { credentials: 'include' });
      const contentType = response.headers.get('content-type') || '';

      if (response.status === 401) {
        setAuth('login');
        return false;
      }

      if (!response.ok || !contentType.includes('application/json')) {
        throw new Error('Area administrativa sem resposta da API.');
      }

      const payload = await response.json();
      setData({
        ...payload,
        tools: payload.tools || staticTools.map((tool) => normalizeToolForm({ ...tool, status: 'publicada' }, 'publicada')),
        newsletterIssues: payload.newsletterIssues || [],
      });
      setAuth('ok');
      return true;
    } catch (error) {
      await loadLocalData();
      setMessage(error.message);
      return true;
    }
  }

  useEffect(() => {
    if (forceLoginView) {
      setAuth('login');
      return;
    }

    if (isLocalPreview()) {
      if (hasLocalAuth()) loadLocalData();
      else setAuth('login');
      return;
    }

    loadData();
  }, [forceLoginView]);

  function upsertStateItem(key, item) {
    setData((current) => {
      if (!current) return current;
      const currentItems = current[key] || [];
      return {
        ...current,
        [key]: [item, ...currentItems.filter((existing) => existing.id !== item.id)],
      };
    });
  }

  async function saveNews(status, sourceItem = null) {
    const item = normalizeNewsForm(sourceItem || newsForm, status);
    if (!item.titlePt || !item.link) {
      setMessage('Preencha titulo e link da noticia.');
      return;
    }

    setSaving(true);
    setMessage('');

    if (data?.localPreview) {
      const current = readJson(localNewsItemsKey, []).filter((news) => news.id !== item.id);
      saveJson(localNewsItemsKey, [item, ...current]);
      upsertStateItem('newsItems', item);
      setNewsForm(item);
      setSaving(false);
      setMessage(status === 'aprovada' ? 'Noticia publicada no modo local.' : 'Noticia salva como rascunho.');
      return;
    }

    try {
      const response = await fetch('/api/admin-news-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ item, status }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Falha ao salvar noticia');
      upsertStateItem('newsItems', payload.item);
      setNewsForm(payload.item);
      setMessage(status === 'aprovada' ? 'Noticia publicada no blog.' : 'Noticia salva.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  function toggleEmailItem(item) {
    if (!isPublished(item.status) && !selectedNewsIds.includes(item.id)) {
      setMessage('Publique a noticia antes de incluir no email.');
      return;
    }

    setSelectedNewsIds((current) => {
      if (current.includes(item.id)) return current.filter((id) => id !== item.id);
      if (current.length >= 10) {
        setMessage('A edicao de email aceita no maximo 10 noticias.');
        return current;
      }
      return [...current, item.id];
    });
  }

  async function runNewsAgent() {
    setRunningNewsAgent(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin-news-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'collect_news', limit: 20 }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Falha ao buscar noticias');

      setData((current) => ({
        ...current,
        newsItems: mergeById(current?.newsItems || [], payload.items || []),
        warnings: [...(current?.warnings || []), ...(payload.failedSources || []).map((item) => item.source + ': ' + item.error)],
      }));
      setMessage(payload.stored + ' noticias novas/atualizadas entraram para avaliacao.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setRunningNewsAgent(false);
    }
  }

  async function saveNewsletterIssue() {
    const selectedItems = (data?.newsItems || []).filter((item) => selectedNewsIds.includes(item.id)).slice(0, 10);
    if (selectedItems.length === 0) {
      setMessage('Selecione noticias publicadas para montar o email.');
      return;
    }

    const issue = {
      ...newsletterForm,
      status: 'agendada',
      items: selectedItems,
    };

    setSaving(true);
    setMessage('');

    if (data?.localPreview) {
      const current = readJson(localNewsletterIssuesKey, []);
      const localIssue = {
        ...issue,
        id: issue.id || slugify((issue.subject || 'curadoria') + '-' + new Date().toISOString()),
        items: selectedItems,
      };
      saveJson(localNewsletterIssuesKey, [localIssue, ...current.filter((item) => item.id !== localIssue.id)]);
      setData((currentData) => ({ ...currentData, newsletterIssues: [localIssue, ...(currentData.newsletterIssues || [])] }));
      setSelectedNewsIds([]);
      setSaving(false);
      setMessage('Selecao armazenada no modo local.');
      return;
    }

    try {
      const response = await fetch('/api/admin-news-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...issue, type: 'newsletter_issue', issueType: issue.type, issueStatus: issue.status }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Falha ao salvar email');
      setData((current) => ({
        ...current,
        newsletterIssues: [payload.issue, ...(current.newsletterIssues || []).filter((item) => item.id !== payload.issue.id)],
      }));
      setSelectedNewsIds([]);
      setMessage('Edicao com ' + payload.issue.items.length + ' itens armazenada para envio programado.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function saveTool(status, sourceItem = null) {
    const item = normalizeToolForm(sourceItem || toolForm, status);
    if (!item.name || !item.link) {
      setMessage('Preencha nome e link da ferramenta.');
      return;
    }

    setSaving(true);
    setMessage('');

    if (data?.localPreview) {
      const current = readJson(localToolsKey, []).filter((tool) => tool.id !== item.id);
      saveJson(localToolsKey, [item, ...current]);
      upsertStateItem('tools', item);
      setToolForm(item);
      setSaving(false);
      setMessage(status === 'publicada' ? 'Ferramenta publicada no modo local.' : 'Ferramenta salva como rascunho.');
      return;
    }

    try {
      const response = await fetch('/api/admin-news-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type: 'tool', tool: item, status }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Falha ao salvar ferramenta');
      upsertStateItem('tools', payload.item);
      setToolForm(payload.item);
      setMessage(status === 'publicada' ? 'Ferramenta publicada em /recursos.' : 'Ferramenta salva.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    if (isLocalPreview()) {
      window.localStorage.removeItem(localAuthKey);
      setAuth('login');
      setData(null);
      return;
    }

    await fetch('/api/admin-logout', { method: 'POST', credentials: 'include' });
    setAuth('login');
    setData(null);
  }

  const metrics = useMemo(() => {
    const news = data?.newsItems || [];
    const tools = data?.tools || [];
    const clients = groupBriefingResponsesByClient(data?.subscribers || []);
    const laneCount = (lane) => clients.filter((client) => client.journey?.lane === lane).length;
    return {
      clicks: data?.clicks?.length || 0,
      leads: data?.subscribers?.length || 0,
      clients: clients.length,
      briefingResponses: clients.reduce((total, client) => total + client.responses.length, 0),
      proposal: laneCount('proposal'),
      remarketing: laneCount('remarketing'),
      triage: laneCount('triage'),
      publishedNews: news.filter((item) => isPublished(item.status)).length,
      draftNews: news.filter((item) => !isPublished(item.status)).length,
      publishedTools: tools.filter((item) => isPublished(item.status)).length,
      draftTools: tools.filter((item) => !isPublished(item.status)).length,
    };
  }, [data]);

  if (auth === 'login') {
    return <AdminLoginScreen onAuthenticated={isLocalPreview() ? loadLocalData : loadData} />;
  }

  if (!data) {
    return <div className="py-20 text-center text-slate-500">Carregando admin...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-400">Admin VANT</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Jornada do cliente</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
              Acompanhe cada oportunidade desde o pre-briefing ate atendimento, follow-up, proposta ou remarketing.
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-white/30 hover:text-white"
          >
            Sair
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Clientes" value={metrics.clients} hint="agrupados por email ou WhatsApp" />
          <StatCard label="Proposta" value={metrics.proposal} hint="prontos para preparar proposta" />
          <StatCard label="Remarketing" value={metrics.remarketing} hint="nutrir antes da venda" />
          <StatCard label="Triagem" value={metrics.triage} hint="faltam dados ou validacao" />
        </div>
      </header>

      {(message || data.warnings?.length > 0) && (
        <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
          {[message, ...(data.warnings || [])].filter(Boolean).join(' · ')}
        </div>
      )}

      <LeadsPanel
        leads={data.subscribers || []}
        localMode={Boolean(data.localPreview)}
        onMessage={setMessage}
        onRefresh={data.localPreview ? loadLocalData : loadData}
      />
    </div>
  );
}

export default AdminPublishingPage;
