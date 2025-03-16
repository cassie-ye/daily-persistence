import {
  createLocalFontProcessor,
} from '@unocss/preset-web-fonts/local'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    // 基础组件
    ['btn', 'px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-[#c27aff] to-[#e7a5af] hover:opacity-90 text-white transition-all'],
    ['btn-primary', 'px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-[#c27aff] to-[#e7a5af] text-white hover:opacity-90 transition-all flex items-center justify-center'],
    ['card', 'bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow'],
    ['input', 'px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#c27aff]'],

    // 图标按钮
    ['icon-btn', 'inline-flex justify-center items-center w-8 h-8 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800'],

    // 开关组件
    ['switch', 'relative inline-block w-12 h-6'],
    ['switch-input', 'opacity-0 w-0 h-0'],
    ['slider', 'absolute cursor-pointer inset-0 bg-gray-300 dark:bg-gray-600 rounded-full transition-all'],
    ['slider-before', 'absolute content-[""] h-5 w-5 left-0.5 bottom-0.5 bg-white rounded-full transition-all'],
    ['slider-checked', 'bg-gradient-to-r from-[#c27aff] to-[#e7a5af]'],
    ['slider-checked-before', 'translate-x-6'],

    // 布局相关
    ['bg-base', 'bg-white dark:bg-dark'],
    ['text-base', 'text-gray-900 dark:text-gray-100'],

    // 成就相关
    ['achievement-unlocked', 'hover:scale-105 hover:shadow-lg cursor-pointer'],
    ['achievement-level-easy', 'bg-opacity-20 bg-green-500 text-green-500'],
    ['achievement-level-medium', 'bg-opacity-20 bg-[#c27aff] text-[#c27aff]'],
    ['achievement-level-hard', 'bg-opacity-20 bg-purple-500 text-purple-500'],
    ['achievement-level-expert', 'bg-opacity-20 bg-red-500 text-red-500'],
    ['achievement-level-default', 'bg-opacity-20 bg-gray-500 text-gray-500'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
      processors: createLocalFontProcessor(),
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: 'prose prose-sm m-auto text-left'.split(' '),
})
