declare module 'deepseek-api' {
  interface DeepSeekConfig {
    apiKey: string;
  }

  interface CompletionOptions {
    prompt: string;
    model: string;
    maxTokens: number;
  }

  interface CompletionChoice {
    text: string;
  }

  interface CompletionResponse {
    choices: CompletionChoice[];
  }

  const deepseek: {
    config(options: DeepSeekConfig): void;
    complete(options: CompletionOptions): Promise<CompletionResponse>;
  };

  export default deepseek;
}
