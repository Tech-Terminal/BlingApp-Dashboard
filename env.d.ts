/// <reference types="vite/client" />
export {};
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $translate: (text: string) => string;
    $formatName: (name: string | number) => string;
  }
}
