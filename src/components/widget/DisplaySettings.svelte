<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import {
  getDefaultHue,
  getHue,
  setHue,
  THEME_COLOR_PRESETS,
} from "@utils/setting-utils";

let hue = getHue();
const defaultHue = getDefaultHue();
const colorPresets = THEME_COLOR_PRESETS;

function resetHue() {
	hue = getDefaultHue();
}

function selectPreset(nextHue: number) {
  hue = nextHue;
}

$: if (hue || hue === 0) {
	setHue(hue);
}
</script>

<div id="display-setting" class="float-panel float-panel-closed absolute transition-all w-80 right-4 px-4 py-4">
    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            {i18n(I18nKey.themeColor)}
                <button aria-label="重置为默认色" class="btn-regular w-7 h-7 rounded-md  active:scale-90 will-change-transform"
                    class:opacity-0={hue === defaultHue} class:pointer-events-none={hue === defaultHue} on:click={resetHue}>
                <div class="text-[var(--btn-content)]">
                    <Icon icon="fa6-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon>
                </div>
            </button>
        </div>
        <div class="text-xs font-semibold text-[var(--btn-content)]">
            {colorPresets.find(preset => preset.hue === hue)?.label}
        </div>
    </div>
    <div class="grid grid-cols-3 gap-2 select-none">
        {#each colorPresets as preset}
            <button
                aria-label={`选择${preset.label}`}
                class="color-option btn-regular h-12 rounded-lg px-2 flex flex-col items-center justify-center gap-1 active:scale-95"
                class:color-option-selected={hue === preset.hue}
                on:click={() => selectPreset(preset.hue)}
            >
                <span class="color-swatch" style={`background-color: ${preset.hex}`}></span>
                <span class="text-[10px] leading-none font-semibold text-[var(--btn-content)]">
                    {preset.label}
                </span>
            </button>
        {/each}
    </div>
</div>


<style lang="stylus">
    .color-swatch
      width 1.1rem
      height 1.1rem
      border-radius 9999px
      border 1px solid rgba(0, 0, 0, 0.12)

    :global(.dark) .color-swatch
      border 1px solid rgba(255, 255, 255, 0.2)

    .color-option-selected
      outline 2px solid var(--primary)
      outline-offset 1px

</style>
