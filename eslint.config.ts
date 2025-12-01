import fs from "fs";

import pluginJs from "@eslint/js";
import pluginTypeScript from "@typescript-eslint/eslint-plugin";
import * as parserTypeScript from "@typescript-eslint/parser";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import { globalIgnores } from "eslint/config";
import pluginImport from "eslint-plugin-import";
import pluginOxlint from "eslint-plugin-oxlint";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";
import * as parserVue from "vue-eslint-parser";

// 解析自动导入配置
const autoImportConfig = JSON.parse(fs.readFileSync(".eslintrc-auto-import.json", "utf-8"));
/** @type {import('eslint').Linter.Config[]} */

export default defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },

  globalIgnores(["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]),

  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,
  ...pluginOxlint.configs["flat/recommended"],
  skipFormatting,

  // 忽略指定文件
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "unpackage/**",
      "public/**",
      "static/**",
      "**/auto-imports.d.ts",
      "src/types/auto-imports.d.ts",
      "**/**.d.ts",
      ".prettierrc.json",
    ],
  },
  // 检查文件的配置
  {
    files: ["**/*.{js,mjs,cjs,ts,vue}"],
    ignores: ["**/*.d.ts"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...autoImportConfig.globals,
        ...{
          uni: "readonly", // uni-app 全局对象
          UniApp: "readonly", // uni-app 全局对象
          ResponseData: "readonly", // 统一响应数据类型
          PageResult: "readonly", // 分页结果数据类型
          PageQuery: "readonly", // 分页查询数据类型
          OptionType: "readonly", // 选项类型
          getCurrentPages: "readonly", // uni-app 全局 API
        },
      },
    },
    plugins: { import: pluginImport },
    rules: {
      "no-unused-vars": "off",
      "no-prototype-builtins": "off", // 允许直接调用Object.prototype方法
      "no-constant-binary-expression": "warn", // 将常量二元表达式警告降为警告级别
      "no-non-null-assertion": "off",
      // Import 排序规则
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // Node.js 内置模块
            "external", // 外部依赖
            "internal", // 内部模块
            ["parent", "sibling", "index"], // 相对路径导入
          ],
          pathGroups: [
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
      "import/newline-after-import": "error", // import 后需要空行
    },
  },
  // JavaScript 配置
  pluginJs.configs.recommended,

  // TypeScript 配置
  {
    files: ["**/*.ts"],
    ignores: ["**/*.d.ts"], // 排除d.ts文件
    languageOptions: {
      parser: parserTypeScript,
      parserOptions: {
        sourceType: "module",
      },
    },
    plugins: { "@typescript-eslint": pluginTypeScript, import: pluginImport },
    rules: {
      ...pluginTypeScript.configs.strict.rules, // TypeScript 严格规则
      "@typescript-eslint/no-explicit-any": "off", // 允许使用 any
      "@typescript-eslint/no-empty-function": "off", // 允许空函数
      "@typescript-eslint/no-empty-object-type": "off", // 允许空对象类型
      "@typescript-eslint/no-non-null-assertion": "off",
      // Import 排序规则
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
          pathGroups: [
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

  // Vue 配置
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        parser: parserTypeScript,
        sourceType: "module",
      },
    },
    plugins: { vue: pluginVue, "@typescript-eslint": pluginTypeScript, import: pluginImport },
    processor: pluginVue.processors[".vue"],
    rules: {
      ...pluginVue.configs["recommended"].rules, // Vue 3 推荐规则
      "vue/no-v-html": "off", // 允许 v-html
      "vue/multi-word-component-names": "off", // 允许单个单词组件名
      "@typescript-eslint/no-non-null-assertion": "off",
      "no-unused-vars": "off",
      // Import 排序规则（Vue 文件）
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
          pathGroups: [
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
