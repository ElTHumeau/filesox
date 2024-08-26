import { z } from "zod";

const environmentSchema = z.object({
    VITE_API_URL: z.string().url(),
});

const parseResults = environmentSchema.safeParse(import.meta.env);

if (!parseResults.success) {
    console.error("Invalid environment variables:", parseResults.error.format());
    throw new Error("Invalid environment variables");
}

export const environmentVariables = parseResults.data;

type EnvVarSchemaType = z.infer<typeof environmentSchema>;

declare global {
    interface ImportMetaEnv extends EnvVarSchemaType {}
}