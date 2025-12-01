import fs from "fs";

import { globalIgnores } from "eslint/config";

import pluginJs from "@eslint/js";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import pluginImport from "eslint-plugin-import";
import pluginOxlint from "eslint-plugin-oxlint";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";

// 解析自动导入配置
const autoImportConfig = JSON.parse(fs.readFileSync(".eslintrc-auto-import.json", "utf-8"));

/** @type {import('eslint').Linter.Config[]} */
export default defineConfigWithVueTs(
  // 1. 文件匹配
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },

  // 2. 全局忽略
  globalIgnores(["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]),

  // 3. 基础预设配置（先加载）
  pluginJs.configs.recommended,
  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,
  ...pluginOxlint.configs["flat/recommended"],
  skipFormatting,

  // 4. 自定义忽略规则
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "unpackage/**",
      "public/**",
      "static/**",
      "**/auto-imports.d.ts",
      "src/types/auto-imports.d.ts",
      "**/*.d.ts",
      ".prettierrc.json",
    ],
  },

  // 5. 通用 JavaScript/TypeScript 配置
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    ignores: ["**/*.d.ts"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...autoImportConfig.globals,
      },
    },
    plugins: {
      import: pluginImport,
    },
    rules: {
      // 使用 TypeScript 版本的 no-unused-vars
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-prototype-builtins": "off",
      "no-constant-binary-expression": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      // Import 排序规则
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
          pathGroups: [
            {
              pattern: "eslint/**", // 添加这个
              group: "external",
              position: "before",
            },
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/newline-after-import": "error",
    },
  },

  // 6. Vue 文件特定配置
  {
    files: ["**/*.vue"],
    rules: {
      "vue/no-v-html": "off",
      "vue/multi-word-component-names": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      // Import 排序规则
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
          pathGroups: [
            {
              pattern: "eslint/**", // 添加这个
              group: "external",
              position: "before",
            },
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/newline-after-import": "error",
    },
  },
);
