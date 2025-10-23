// Centralized feature flags utility
// Source of truth: environment variables with safe defaults

export type FeatureFlags = {
  // Enables GPT-5 across all clients/features that check this flag
  gpt5: boolean;
};

// Read boolean-like env var; default to true to "enable for all clients"
const envBool = (val: string | undefined, defaultValue: boolean) => {
  if (val === undefined || val === null) return defaultValue;
  const v = String(val).trim().toLowerCase();
  if (["1", "true", "yes", "y", "on", "enabled"].includes(v)) return true;
  if (["0", "false", "no", "n", "off", "disabled"].includes(v)) return false;
  return defaultValue;
};

export function getFeatureFlags(): FeatureFlags {
  return {
    // Default ON so it's enabled globally unless explicitly disabled via env
    gpt5: envBool(process.env.GPT5_ENABLED, true),
  };
}
