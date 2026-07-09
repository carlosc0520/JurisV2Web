<template>
  <div class="jurisgpt-root">
    <!-- ── Sidebar de sesiones ─────────────────────────────────── -->
    <aside class="jurisgpt-sidebar">
      <div class="sidebar-header">
        <button class="btn-new" @click="newSession" :disabled="loading">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Nueva conversación
        </button>
      </div>

      <div class="sessions-list">
        <div v-if="sessionsLoading" class="sessions-empty">
          <div class="spinner-sm"></div>
        </div>
        <div v-else-if="!sessions.length" class="sessions-empty">
          <p>Sin conversaciones aún</p>
        </div>
        <div
          v-for="s in sessions"
          :key="s.id"
          class="session-item"
          :class="{ active: currentSession?.id === s.id }"
          @click="selectSession(s)"
        >
          <svg class="session-icon" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          <span class="session-title">{{ s.titulo || 'Nueva conversación' }}</span>
          <button class="session-delete" @click.stop="confirmDelete(s.id)" title="Eliminar">
            <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- ── Panel de chat ───────────────────────────────────────── -->
    <main class="jurisgpt-main">
      <!-- Estado vacío -->
      <div v-if="!currentSession && !isNewSession" class="empty-state">
        <div class="empty-icon">⚖️</div>
        <h2 class="empty-title">Bienvenido a JurisGPT</h2>
        <p class="empty-desc">
          Consulta jurisprudencia y legislación peruana con inteligencia artificial.<br>
          Las respuestas se basan en las entradas indexadas de la plataforma.
        </p>
        <button class="btn-start" @click="newSession">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Iniciar conversación
        </button>
      </div>

      <!-- Chat activo -->
      <template v-else>
        <!-- Cabecera del chat -->
        <div class="chat-header">
          <div class="chat-header-info">
            <span class="chat-header-title">{{ currentSession?.titulo || 'Nueva conversación' }}</span>
          </div>
          <div class="chat-header-tokens" v-if="totalTokensSession">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            {{ totalTokensSession.toLocaleString() }} tokens usados
          </div>
        </div>

        <!-- Mensajes -->
        <div class="messages-area" ref="messagesEl">
          <div v-if="msgsLoading" class="msgs-loading">
            <div class="spinner-sm"></div>
          </div>

          <div v-else-if="!messages.length" class="msgs-empty">
            <p>Escribe tu primera consulta jurídica.</p>
          </div>

          <template v-else>
            <div v-for="msg in messages" :key="msg.id" class="message-row" :class="msg.rol">
              <!-- Mensaje del usuario -->
              <div v-if="msg.rol === 'user'" class="msg-user">
                <div class="bubble-user">{{ msg.contenido }}</div>
              </div>

              <!-- Mensaje del asistente -->
              <div v-else class="msg-assistant">
                <div class="assistant-avatar">IA</div>
                <div class="assistant-body">
                  <div class="bubble-assistant" v-html="renderText(msg.contenido)"></div>
                  <!-- Fuentes -->
                  <div v-if="msg.sources && msg.sources.length" class="sources-row">
                    <span class="sources-label">Fuentes:</span>
                    <button
                      v-for="src in msg.sources"
                      :key="src.id"
                      class="source-chip"
                      @click="goToEntry(src.id)"
                      :title="src.titulo"
                    >
                      <svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/>
                      </svg>
                      {{ truncate(src.titulo, 36) }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- Indicador de escritura -->
          <div v-if="loading" class="message-row assistant">
            <div class="msg-assistant">
              <div class="assistant-avatar">IA</div>
              <div class="bubble-assistant typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="input-area">
          <div class="input-composer" :class="{ 'is-focused': inputFocused, 'is-loading': loading }">
            <textarea
              ref="inputEl"
              v-model="inputText"
              rows="1"
              class="chat-input"
              placeholder="Escribe tu consulta jurídica…"
              :disabled="loading"
              @keydown.enter.exact.prevent="sendMessage"
              @input="autoResize"
              @focus="inputFocused = true"
              @blur="inputFocused = false"
            ></textarea>
            <button
              class="send-btn"
              :disabled="loading || !inputText.trim()"
              @click="sendMessage"
            >
              <div v-if="loading" class="send-spinner"></div>
              <svg v-else width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <p class="input-hint">
            <svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="display:inline;vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            Enter para enviar · Shift+Enter nueva línea · Respuestas basadas en jurisprudencia JurisSearch
          </p>
        </div>
      </template>
    </main>
  </div>
</template>

<script>
import JurisGPTProxy from "@/proxies/JurisGPTProxy";

export default {
  name: "JurisGPT",
  props: { role: { type: [Object, Array], default: () => ({}) } },

  data() {
    return {
      sessions: [],
      sessionsLoading: false,
      currentSession: null,
      isNewSession: false,
      messages: [],
      msgsLoading: false,
      inputText: "",
      loading: false,
      inputFocused: false,
    };
  },

  computed: {
    totalTokensSession() {
      return this.messages.reduce((acc, m) => acc + (m.tokens ?? 0), 0);
    },
  },

  mounted() {
    this.loadSessions();
  },

  methods: {
    async loadSessions() {
      this.sessionsLoading = true;
      try {
        const data = await JurisGPTProxy.getSessions();
        this.sessions = Array.isArray(data?.DATA) ? data.DATA : (Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error cargando sesiones:", e);
      } finally {
        this.sessionsLoading = false;
      }
    },

    async newSession() {
      this.currentSession = null;
      this.isNewSession = true;
      this.messages = [];
      this.inputText = "";
      this.$nextTick(() => this.$refs.inputEl?.focus());
    },

    async selectSession(session) {
      if (this.currentSession?.id === session.id) return;
      this.isNewSession = false;
      this.currentSession = session;
      this.messages = [];
      this.msgsLoading = true;
      try {
        const data = await JurisGPTProxy.getMessages(session.id);
        this.messages = Array.isArray(data?.DATA) ? data.DATA : (Array.isArray(data) ? data : []);
        this.$nextTick(() => this.scrollBottom());
      } catch (e) {
        console.error("Error cargando mensajes:", e);
      } finally {
        this.msgsLoading = false;
      }
    },

    async sendMessage() {
      const text = this.inputText.trim();
      if (!text || this.loading) return;

      // Si no hay sesión activa, la crea el backend en el primer mensaje
      const chatId = this.currentSession?.id ?? null;

      // Mostrar el mensaje del usuario optimistamente
      this.messages.push({ id: Date.now(), rol: "user", contenido: text, sources: [] });
      this.inputText = "";
      this.$nextTick(() => {
        this.autoResize({ target: this.$refs.inputEl });
        this.scrollBottom();
      });
      this.loading = true;

      try {
        const res = await JurisGPTProxy.chat(chatId, text);
        const data = res?.DATA ?? res;

        // Cuota mensual de IA agotada: mostrar el aviso sin tocar sesiones
        if (data.hasQuota === false) {
          this.messages.push({
            id: Date.now(),
            rol: "assistant",
            contenido: data.answer,
            sources: [],
          });
          this.$nextTick(() => this.scrollBottom());
          return;
        }

        // Si era nueva sesión, actualizar estado con la sesión creada
        if (!chatId) {
          const newSession = { id: data.chatId, titulo: text.slice(0, 60), estado: "A" };
          this.sessions.unshift(newSession);
          this.currentSession = newSession;
          this.isNewSession = false;
        } else {
          // Actualizar título si cambió
          const idx = this.sessions.findIndex(s => s.id === data.chatId);
          if (idx !== -1 && !this.sessions[idx].titulo) {
            this.sessions[idx].titulo = text.slice(0, 60);
          }
        }

        // Agregar respuesta del asistente
        this.messages.push({
          id: data.msgId,
          rol: "assistant",
          contenido: data.answer,
          sources: data.sources ?? [],
          tokens: data.tokens ?? 0,
        });
        this.$nextTick(() => this.scrollBottom());
      } catch (e) {
        console.error("Error en chat:", e);
        this.messages.push({
          id: Date.now(),
          rol: "assistant",
          contenido: "Ocurrió un error al procesar tu consulta. Por favor intenta de nuevo.",
          sources: [],
        });
      } finally {
        this.loading = false;
        this.$nextTick(() => this.$refs.inputEl?.focus());
      }
    },

    async confirmDelete(sessionId) {
      if (!confirm("¿Eliminar esta conversación?")) return;
      try {
        await JurisGPTProxy.deleteSession(sessionId);
        this.sessions = this.sessions.filter(s => s.id !== sessionId);
        if (this.currentSession?.id === sessionId) {
          this.currentSession = null;
          this.messages = [];
        }
      } catch (e) {
        console.error("Error eliminando sesión:", e);
      }
    },

    goToEntry(entryId) {
      const route = this.role?.IDR === 2
        ? `/usuario/busqueda?id=${entryId}`
        : `/admin/busqueda?id=${entryId}`;
      const url = this.$router.resolve(route).href;
      window.open(url, '_blank');
    },

    scrollBottom() {
      const el = this.$refs.messagesEl;
      if (el) el.scrollTop = el.scrollHeight;
    },

    autoResize(event) {
      const el = event?.target ?? this.$refs.inputEl;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 140) + "px";
    },

    renderText(text) {
      if (!text) return "";
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>");
    },

    truncate(str, len) {
      if (!str) return "";
      return str.length > len ? str.slice(0, len) + "…" : str;
    },
  },
};
</script>

<style scoped>
/* ── Layout raíz ─────────────────────────────────────────────── */
.jurisgpt-root {
  display: flex;
  height: calc(100vh - 64px);
  overflow: hidden;
  background: #f0f2f8;
}
:root.dark .jurisgpt-root { background: #0d1117; }

/* ── Sidebar ─────────────────────────────────────────────────── */
.jurisgpt-sidebar {
  width: 280px;
  min-width: 220px;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  overflow: hidden;
}
:root.dark .jurisgpt-sidebar {
  background: #1f2937;
  border-color: #374151;
}

.sidebar-header {
  padding: 16px 14px 14px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
:root.dark .sidebar-header { border-color: #374151; }

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}
.brand-icon { font-size: 18px; }
.brand-name {
  font-size: 15px;
  font-weight: 700;
  background: linear-gradient(135deg, #DF2DB2, #185CE6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.btn-new {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #DF2DB2, #185CE6);
  border: none;
  cursor: pointer;
  transition: opacity 0.15s;
}
.btn-new:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-new:not(:disabled):hover { opacity: 0.88; }

.sessions-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sessions-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 0;
  color: #9ca3af;
  font-size: 13px;
}

.session-item {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 10px;
  border-radius: 7px;
  cursor: pointer;
  transition: background 0.12s;
  color: #374151;
  font-size: 13px;
  min-width: 0;
}
:root.dark .session-item { color: #d1d5db; }

.session-item:hover { background: #f3f4f6; }
:root.dark .session-item:hover { background: #374151; }

.session-item.active {
  background: linear-gradient(135deg, rgba(223,45,178,0.1), rgba(24,92,230,0.1));
  color: #185CE6;
  font-weight: 600;
}
:root.dark .session-item.active { color: #93c5fd; }

.session-icon { flex-shrink: 0; opacity: 0.6; }

.session-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-delete {
  flex-shrink: 0;
  display: none;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
}
.session-item:hover .session-delete { display: flex; }
.session-delete:hover { background: #fee2e2; color: #dc2626; }

/* ── Main ────────────────────────────────────────────────────── */
.jurisgpt-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── Empty state ─────────────────────────────────────────────── */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 24px;
  background: radial-gradient(ellipse at 60% 30%, rgba(223,45,178,0.06), transparent 60%),
              radial-gradient(ellipse at 30% 70%, rgba(24,92,230,0.07), transparent 60%);
}
.empty-icon {
  font-size: 56px;
  margin-bottom: 20px;
  filter: drop-shadow(0 4px 16px rgba(24,92,230,0.2));
  animation: floatIcon 3s ease-in-out infinite;
}
@keyframes floatIcon {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}
.empty-title {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #DF2DB2, #185CE6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}
.empty-desc {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.7;
  max-width: 400px;
  margin-bottom: 28px;
}
:root.dark .empty-desc { color: #9ca3af; }
.btn-start {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #DF2DB2, #185CE6);
  color: #fff;
  border: none;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(24,92,230,0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-start:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(24,92,230,0.4);
}
.btn-start:active { transform: translateY(0); }

/* ── Chat header ─────────────────────────────────────────────── */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 22px;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(229,231,235,0.8);
  flex-shrink: 0;
}
:root.dark .chat-header {
  background: rgba(31,41,55,0.85);
  border-color: rgba(55,65,81,0.8);
}
.chat-header-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 500px;
}
:root.dark .chat-header-title { color: #f3f4f6; }
.chat-header-tokens {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 3px 10px;
  border-radius: 20px;
  white-space: nowrap;
}
:root.dark .chat-header-tokens { background: #374151; }

/* ── Messages area ───────────────────────────────────────────── */
.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  background-color: #f0f2f8;
  background-image:
    radial-gradient(circle at 1px 1px, rgba(148,163,184,0.25) 1px, transparent 0);
  background-size: 28px 28px;
}
:root.dark .messages-area {
  background-color: #0d1117;
  background-image:
    radial-gradient(circle at 1px 1px, rgba(75,85,99,0.3) 1px, transparent 0);
}

.msgs-loading, .msgs-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: #9ca3af;
  font-size: 13px;
}

/* ── Messages ────────────────────────────────────────────────── */
.message-row {
  display: flex;
  flex-direction: column;
  animation: msgIn 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes msgIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.msg-user { display: flex; justify-content: flex-end; }
.bubble-user {
  max-width: 70%;
  padding: 12px 18px;
  border-radius: 20px 20px 5px 20px;
  background: linear-gradient(135deg, #DF2DB2, #185CE6);
  color: #fff;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  box-shadow: 0 4px 14px rgba(24,92,230,0.25);
}

.msg-assistant { display: flex; align-items: flex-start; gap: 12px; }
.assistant-avatar {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #DF2DB2, #185CE6);
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 10px rgba(24,92,230,0.3);
}
.assistant-body { flex: 1; min-width: 0; }
.bubble-assistant {
  display: inline-block;
  max-width: 100%;
  padding: 13px 18px;
  border-radius: 5px 20px 20px 20px;
  background: #fff;
  border: 1px solid rgba(229,231,235,0.8);
  color: #1f2937;
  font-size: 14px;
  line-height: 1.7;
  word-break: break-word;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
:root.dark .bubble-assistant {
  background: #1e2433;
  border-color: #2d3748;
  color: #e2e8f0;
  box-shadow: 0 2px 12px rgba(0,0,0,0.2);
}

/* ── Typing indicator ────────────────────────────────────────── */
.typing-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 16px 20px;
}
.typing-indicator span {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #DF2DB2, #185CE6);
  animation: typingBounce 1.3s ease-in-out infinite;
}
.typing-indicator span:nth-child(2) { animation-delay: 0.18s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.36s; }
@keyframes typingBounce {
  0%, 60%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
  30% { transform: translateY(-8px) scale(1.1); opacity: 1; }
}

/* ── Sources ─────────────────────────────────────────────────── */
.sources-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}
.sources-label {
  font-size: 10px;
  color: #9ca3af;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.source-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 11px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  color: #185CE6;
  background: rgba(24,92,230,0.07);
  border: 1px solid rgba(24,92,230,0.18);
  cursor: pointer;
  transition: all 0.18s;
  white-space: nowrap;
}
:root.dark .source-chip {
  color: #93c5fd;
  background: rgba(24,92,230,0.1);
  border-color: rgba(24,92,230,0.22);
}
.source-chip:hover {
  background: rgba(24,92,230,0.14);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(24,92,230,0.15);
}

/* ── Input area ──────────────────────────────────────────────── */
.input-area {
  padding: 16px 24px 20px;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(229,231,235,0.7);
  flex-shrink: 0;
}
:root.dark .input-area {
  background: rgba(17,24,39,0.9);
  border-color: rgba(55,65,81,0.7);
}

.input-composer {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  background: #fff;
  border-radius: 18px;
  padding: 12px 12px 12px 18px;
  box-shadow: 0 2px 20px rgba(0,0,0,0.07), 0 0 0 1.5px #e5e7eb;
  transition: box-shadow 0.22s;
}
:root.dark .input-composer {
  background: #1e2433;
  box-shadow: 0 2px 20px rgba(0,0,0,0.25), 0 0 0 1.5px #2d3748;
}
.input-composer.is-focused {
  box-shadow: 0 4px 28px rgba(24,92,230,0.12), 0 0 0 2px #185CE6;
}
:root.dark .input-composer.is-focused {
  box-shadow: 0 4px 28px rgba(24,92,230,0.2), 0 0 0 2px #185CE6;
}

.chat-input {
  flex: 1;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  resize: none;
  font-size: 14px;
  line-height: 1.6;
  color: #111827;
  max-height: 140px;
  overflow-y: auto;
  padding: 0;
  font-family: inherit;
}
:root.dark .chat-input { color: #f1f5f9; }
.chat-input::placeholder { color: #9ca3af; }
.chat-input:disabled { opacity: 0.5; }

.send-btn {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #DF2DB2, #185CE6);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
  box-shadow: 0 2px 10px rgba(24,92,230,0.25);
}
.send-btn:not(:disabled):hover {
  transform: scale(1.08) translateY(-1px);
  box-shadow: 0 6px 18px rgba(24,92,230,0.38);
}
.send-btn:not(:disabled):active { transform: scale(0.94); }
.send-btn:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }

.send-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
}

.input-hint {
  font-size: 11px;
  color: #b0b7c3;
  text-align: center;
  margin-top: 10px;
  line-height: 1.5;
}

/* ── Spinner sm ──────────────────────────────────────────────── */
.spinner-sm {
  width: 22px;
  height: 22px;
  border: 2.5px solid #e5e7eb;
  border-top-color: #185CE6;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Scrollbar ───────────────────────────────────────────────── */
.messages-area::-webkit-scrollbar { width: 5px; }
.messages-area::-webkit-scrollbar-track { background: transparent; }
.messages-area::-webkit-scrollbar-thumb {
  background: rgba(148,163,184,0.4);
  border-radius: 3px;
}
.sessions-list::-webkit-scrollbar { width: 4px; }
.sessions-list::-webkit-scrollbar-track { background: transparent; }
.sessions-list::-webkit-scrollbar-thumb {
  background: rgba(148,163,184,0.3);
  border-radius: 3px;
}

@media (max-width: 640px) {
  .jurisgpt-sidebar { width: 220px; min-width: 180px; }
}
</style>
