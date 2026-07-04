export interface Agent {
    readonly id: string;
    name: string;
    description?: string;
    readonly createdAt: Date;
    updatedAt: Date;
}

export type CreateAgentDto = Pick<Agent,"name" | "description">
export type UpdateAgentDto = Partial<Pick<Agent,"name"|"description">>;



