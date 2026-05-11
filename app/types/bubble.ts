export type BubbleStory = {
  title: string;
  subtitle: string;
  mood: string[];
  storyFragments: StoryFragment[];
  followUpPrompts: FollowUpPrompt[];
  replayScript: ReplayScriptItem[];
  originalText: string;
};

export type StoryFragment = {
  id: string;
  type: "scene" | "trigger" | "feeling" | "memory" | "echo";
  title: string;
  text: string;
  mediaSuggestion: MediaSuggestion;
  userCanAdd: string[];
};

export type MediaSuggestion = {
  type: "image" | "video" | "music" | "silence" | "text";
  reason: string;
  visualPrompt?: string;
  audioPrompt?: string;
};

export type FollowUpPrompt = {
  id: string;
  targetFragmentId: string;
  question: string;
  options?: string[];
};

export type ReplayScriptItem = {
  fragmentId: string;
  displayText: string;
  duration: number;
};
