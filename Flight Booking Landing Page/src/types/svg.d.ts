declare module '*.svg?url' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
