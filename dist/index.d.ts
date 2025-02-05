import { Action, Provider, IAgentRuntime, Memory, State, Plugin } from '@elizaos/core';

declare const generateMusic: Action;

declare const customGenerateMusic: Action;

declare const extendAudio: Action;

interface SunoConfig {
    apiKey: string;
    baseUrl?: string;
}
declare class SunoProvider implements Provider {
    private apiKey;
    private baseUrl;
    static get(runtime: IAgentRuntime, _message: Memory, _state?: State): Promise<SunoProvider>;
    constructor(config: SunoConfig);
    get(_runtime: IAgentRuntime, _message: Memory, _state?: State): Promise<{
        status: string;
    }>;
    request(endpoint: string, options?: RequestInit): Promise<any>;
}

declare const sunoPlugin: Plugin;

export { customGenerateMusic as CustomGenerateMusic, extendAudio as ExtendAudio, generateMusic as GenerateMusic, SunoProvider, sunoPlugin as default, sunoPlugin };
