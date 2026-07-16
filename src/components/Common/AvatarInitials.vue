<template>
  <div class="rounded-full flex-shrink-0 overflow-hidden" :style="{ width: sizePx, height: sizePx }">
    <img
      v-if="src && !errored"
      :src="src"
      referrerpolicy="no-referrer"
      @error="errored = true"
      class="w-full h-full rounded-full object-cover"
      alt=""
    />
    <div
      v-else
      class="w-full h-full rounded-full flex items-center justify-center text-white font-semibold select-none"
      :style="{ background: bgColor, fontSize: fontSizePx }"
    >
      {{ initials }}
    </div>
  </div>
</template>

<script>
const PALETTE = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6'];

export default {
  name: 'AvatarInitials',
  props: {
    src:  { type: String, default: null },
    name: { type: String, default: '' },
    size: { type: Number,  default: 40 },
  },
  data() {
    return { errored: false };
  },
  computed: {
    sizePx()     { return `${this.size}px`; },
    fontSizePx() { return `${Math.round(this.size * 0.4)}px`; },
    initials() {
      const parts = (this.name || '').trim().split(/\s+/).filter(Boolean);
      if (!parts.length) return '?';
      const first = parts[0].charAt(0);
      const last  = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
      return (first + last).toUpperCase();
    },
    bgColor() {
      let hash = 0;
      for (const ch of (this.name || '')) hash = (hash * 31 + ch.charCodeAt(0)) % PALETTE.length;
      return PALETTE[Math.abs(hash) % PALETTE.length];
    },
  },
  watch: {
    src() { this.errored = false; },
  },
};
</script>
