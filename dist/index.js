// src/providers/suno.ts
var SunoProvider = class _SunoProvider {
  static async get(runtime, _message, _state) {
    const apiKey = runtime.getSetting("SUNO_API_KEY");
    if (!apiKey) {
      throw new Error("SUNO_API_KEY is required");
    }
    return new _SunoProvider({ apiKey });
  }
  constructor(config) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || "https://api.suno.ai/v1";
  }
  async get(_runtime, _message, _state) {
    return { status: "ready" };
  }
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Authorization": `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      ...options.headers
    };
    const response = await fetch(url, {
      ...options,
      headers
    });
    if (!response.ok) {
      throw new Error(`Suno API error: ${response.statusText}`);
    }
    return response.json();
  }
};

// src/actions/generate.ts
var generateMusic = {
  name: "generate-music",
  description: "Generate music using Suno AI",
  similes: [
    "CREATE_MUSIC",
    "MAKE_MUSIC",
    "COMPOSE_MUSIC",
    "GENERATE_AUDIO",
    "CREATE_SONG",
    "MAKE_SONG"
  ],
  validate: async (runtime, _message) => {
    return !!runtime.getSetting("SUNO_API_KEY");
  },
  handler: async (runtime, message, state, _options, callback) => {
    try {
      const provider = await SunoProvider.get(runtime, message, state);
      const content = message.content;
      if (!content.prompt) {
        throw new Error("Missing required parameter: prompt");
      }
      const response = await provider.request("/generate", {
        method: "POST",
        body: JSON.stringify({
          prompt: content.prompt,
          duration: content.duration || 30,
          temperature: content.temperature || 1,
          top_k: content.topK || 250,
          top_p: content.topP || 0.95,
          classifier_free_guidance: content.classifier_free_guidance || 3
        })
      });
      if (callback) {
        callback({
          text: "Successfully generated music based on your prompt",
          content: response
        });
      }
      return true;
    } catch (error) {
      if (callback) {
        callback({
          text: `Failed to extend audio: ${error.message}`,
          error
        });
      }
      return false;
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Create a happy and energetic song",
          prompt: "A cheerful and energetic melody with upbeat rhythm",
          duration: 30,
          temperature: 1
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll generate a happy and energetic song for you.",
          action: "generate-music"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "Successfully generated your upbeat and energetic song."
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Generate a relaxing ambient track",
          prompt: "A peaceful ambient soundscape with gentle waves and soft pads",
          duration: 45,
          temperature: 0.8,
          classifier_free_guidance: 4
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll create a calming ambient piece for you.",
          action: "generate-music"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "Successfully generated your relaxing ambient soundscape."
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Make a short jingle for my podcast",
          prompt: "A catchy and professional podcast intro jingle",
          duration: 15,
          temperature: 1.2,
          top_k: 300
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll generate a podcast jingle for you.",
          action: "generate-music"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "Successfully generated your podcast jingle."
        }
      }
    ]
  ]
};
var generate_default = generateMusic;

// src/actions/customGenerate.ts
var customGenerateMusic = {
  name: "custom-generate-music",
  description: "Generate music with custom parameters using Suno AI",
  similes: [
    "CREATE_CUSTOM_MUSIC",
    "GENERATE_CUSTOM_AUDIO",
    "MAKE_CUSTOM_MUSIC",
    "COMPOSE_CUSTOM_MUSIC",
    "COMPOSE_MUSIC",
    "CREATE_MUSIC",
    "GENERATE_MUSIC"
  ],
  validate: async (runtime, _message) => {
    return !!runtime.getSetting("SUNO_API_KEY");
  },
  handler: async (runtime, message, state, _options, callback) => {
    try {
      const provider = await SunoProvider.get(runtime, message, state);
      const content = message.content;
      if (!content.prompt) {
        throw new Error("Missing required parameter: prompt");
      }
      const response = await provider.request("/custom-generate", {
        method: "POST",
        body: JSON.stringify({
          prompt: content.prompt,
          duration: content.duration || 30,
          temperature: content.temperature || 1,
          top_k: content.topK || 250,
          top_p: content.topP || 0.95,
          classifier_free_guidance: content.classifier_free_guidance || 3,
          reference_audio: content.reference_audio,
          style: content.style,
          bpm: content.bpm,
          key: content.key,
          mode: content.mode
        })
      });
      if (callback) {
        callback({
          text: "Successfully generated custom music",
          content: response
        });
      }
      return true;
    } catch (error) {
      if (callback) {
        callback({
          text: `Failed to generate custom music: ${error.message}`,
          error
        });
      }
      return false;
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Create an upbeat electronic dance track with heavy bass",
          prompt: "An upbeat electronic dance track with heavy bass and energetic synths",
          duration: 60,
          style: "electronic",
          bpm: 128
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll generate an energetic EDM track for you.",
          action: "custom-generate-music"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "Successfully generated your EDM track with heavy bass and synths."
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Generate a calm piano melody in C major",
          prompt: "A gentle, flowing piano melody with soft dynamics",
          duration: 45,
          style: "classical",
          key: "C",
          mode: "major",
          temperature: 0.8
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll create a calming piano piece in C major for you.",
          action: "custom-generate-music"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "Successfully generated your peaceful piano melody in C major."
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Make a rock song with guitar solos",
          prompt: "A rock song with powerful electric guitar solos and driving drums",
          duration: 90,
          style: "rock",
          bpm: 120,
          classifier_free_guidance: 4
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll generate a rock track with guitar solos for you.",
          action: "custom-generate-music"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "Successfully generated your rock song with guitar solos."
        }
      }
    ]
  ]
};
var customGenerate_default = customGenerateMusic;

// src/actions/extend.ts
var extendAudio = {
  name: "extend-audio",
  description: "Extend the duration of an existing audio generation",
  similes: [
    "LENGTHEN_AUDIO",
    "PROLONG_AUDIO",
    "INCREASE_DURATION",
    "MAKE_AUDIO_LONGER"
  ],
  validate: async (runtime, _message) => {
    return !!runtime.getSetting("SUNO_API_KEY");
  },
  handler: async (runtime, message, state, _options, callback) => {
    try {
      const provider = await SunoProvider.get(runtime, message, state);
      const content = message.content;
      if (!content.audio_id || !content.duration) {
        throw new Error("Missing required parameters: audio_id and duration");
      }
      const response = await provider.request("/extend", {
        method: "POST",
        body: JSON.stringify({
          audio_id: content.audio_id,
          duration: content.duration
        })
      });
      if (callback) {
        callback({
          text: `Successfully extended audio ${content.audio_id}`,
          content: response
        });
      }
      return true;
    } catch (error) {
      if (callback) {
        callback({
          text: `Failed to extend audio: ${error.message}`,
          error
        });
      }
      return false;
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Make this song longer by 30 seconds",
          audio_id: "abc123",
          duration: 30
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll extend your song by 30 seconds.",
          action: "extend-audio"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "Successfully extended your song by 30 seconds."
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Double the length of this track",
          audio_id: "xyz789",
          duration: 60
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll double the duration of your track.",
          action: "extend-audio"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "Successfully doubled the length of your track to 60 seconds."
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Add 15 more seconds to this melody",
          audio_id: "def456",
          duration: 15
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll add 15 seconds to your melody.",
          action: "extend-audio"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "Successfully added 15 seconds to your melody."
        }
      }
    ]
  ]
};
var extend_default = extendAudio;

// src/index.ts
var sunoPlugin = {
  name: "suno",
  description: "Suno AI Music Generation Plugin for Eliza",
  actions: [generate_default, customGenerate_default, extend_default],
  evaluators: [],
  providers: [SunoProvider]
};
var index_default = sunoPlugin;
export {
  customGenerate_default as CustomGenerateMusic,
  extend_default as ExtendAudio,
  generate_default as GenerateMusic,
  SunoProvider,
  index_default as default,
  sunoPlugin
};
//# sourceMappingURL=index.js.map