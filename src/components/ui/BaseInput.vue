<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium mb-1.5"
      :class="disabled ? 'text-subtle' : 'text-content'"
    >
      {{ label }}
      <span v-if="required" class="text-brand-pink ml-0.5">*</span>
    </label>

    <!-- Input wrapper -->
    <div class="relative flex items-center">
      <!-- Prepend icon/slot -->
      <div
        v-if="$slots.prepend"
        class="absolute left-3.5 pointer-events-none text-subtle"
      >
        <slot name="prepend" />
      </div>

      <input
        :id="inputId"
        v-bind="$attrs"
        :type="computedType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        class="input-base"
        :class="{
          'pl-10':  $slots.prepend,
          'pr-10':  $slots.append || clearable || isPassword,
          'input-error': !!error,
          'cursor-not-allowed': disabled,
        }"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
        @keydown.enter="$emit('enter', $event)"
      />

      <!-- Password toggle -->
      <button
        v-if="isPassword"
        type="button"
        tabindex="-1"
        class="absolute right-3 text-subtle hover:text-content transition-colors"
        @click="showPass = !showPass"
      >
        <svg v-if="!showPass" class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3-9C7.055 3 3 7.636 3 12s4.055 9 9 9 9-4.636 9-9S16.945 3 12 3z" />
        </svg>
        <svg v-else class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      </button>

      <!-- Clear button -->
      <button
        v-else-if="clearable && modelValue"
        type="button"
        tabindex="-1"
        class="absolute right-3 text-subtle hover:text-content transition-colors"
        @click="$emit('update:modelValue', '')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Append slot -->
      <div v-if="$slots.append && !isPassword && !clearable" class="absolute right-3 text-subtle">
        <slot name="append" />
      </div>
    </div>

    <!-- Error / hint -->
    <p v-if="error" class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
      <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      {{ error }}
    </p>
    <p v-else-if="hint" class="mt-1.5 text-xs text-muted">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue:   { type: [String, Number], default: '' },
  label:        { type: String },
  placeholder:  { type: String },
  type:         { type: String, default: 'text' },
  id:           { type: String },
  error:        { type: String },
  hint:         { type: String },
  disabled:     { type: Boolean, default: false },
  required:     { type: Boolean, default: false },
  clearable:    { type: Boolean, default: false },
  autocomplete: { type: String, default: 'off' },
})

defineEmits(['update:modelValue', 'blur', 'focus', 'enter'])
defineOptions({ inheritAttrs: false })

const inputId  = computed(() => props.id ?? `inp-${Math.random().toString(36).slice(2, 7)}`)
const isPassword = computed(() => props.type === 'password')
const showPass   = ref(false)
const computedType = computed(() => {
  if (isPassword.value) return showPass.value ? 'text' : 'password'
  return props.type
})
</script>
