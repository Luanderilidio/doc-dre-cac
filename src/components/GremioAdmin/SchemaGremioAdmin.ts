import { faker } from "@faker-js/faker";
import { z } from "zod";
import moment from "moment/min/moment-with-locales";
moment.locale("pt-br");

const roles = [
  "DIRETOR",
  "VICE-PRESIDENTE",
  "SECRETÁRIO GERAL I",
  "SECRETÁRIO GERAL II",
  "1° SECRETÁRIO",
  "TESOUREIRO GERAL",
  "1º TESOUREIRO",
  "DIRETOR SOCIAL",
  "DIRETOR DE COMUNICAÇÃO",
  "DIRETOR DE ESPORTES E CULTURA",
  "DIRETOR DE SAÚDE E MEIO AMBIENTE",
] as const;

export enum Roles {
  DIRETOR = "DIRETOR",
  VICE_PRESIDENTE = "VICE-PRESIDENTE",
  SECRETARIO_GERAL_I = "SECRETÁRIO GERAL I",
  SECRETARIO_GERAL_II = "SECRETÁRIO GERAL II",
  PRIMEIRO_SECRETARIO = "1° SECRETÁRIO",
  TESOUREIRO_GERAL = "TESOUREIRO GERAL",
  PRIMEIRO_TESOUREIRO = "1º TESOUREIRO",
  DIRETOR_SOCIAL = "DIRETOR SOCIAL",
  DIRETOR_COMUNICACAO = "DIRETOR DE COMUNICAÇÃO",
  DIRETOR_ESPORTES_CULTURA = "DIRETOR DE ESPORTES E CULTURA",
  DIRETOR_SAUDE_MEIO_AMBIENTE = "DIRETOR DE SAÚDE E MEIO AMBIENTE",
}

export const ROLES_ARRAY = [
  Roles.DIRETOR,
  Roles.VICE_PRESIDENTE,
  Roles.SECRETARIO_GERAL_I,
  Roles.SECRETARIO_GERAL_II,
  Roles.PRIMEIRO_SECRETARIO,
  Roles.TESOUREIRO_GERAL,
  Roles.PRIMEIRO_TESOUREIRO,
  Roles.DIRETOR_SOCIAL,
  Roles.DIRETOR_COMUNICACAO,
  Roles.DIRETOR_ESPORTES_CULTURA,
  Roles.DIRETOR_SAUDE_MEIO_AMBIENTE,
] as const;

const stages = [
  "Comissão Pró-Grêmio",
  "Assembleia Geral",
  "Comissão Eleitoral",
  "Homologação das Chapas",
  "Campanha Eleitoral",
  "Votação",
  "Posse",
] as const;

export enum Stages {
  Comissão_Pró_Grêmio = "Comissão Pró-Grêmio",
  Assembleia_Geral = "Assembleia Geral",
  Comissão_Eleitoral = "Comissão Eleitoral",
  Homologação_das_Chapas = "Homologação das Chapas",
  Campanha_Eleitoral = "Campanha Eleitoral",
  Votação = "Votação",
  Posse = "Posse",
}

export const STAGES_ARRAY = [
  Stages.Comissão_Pró_Grêmio,
  Stages.Assembleia_Geral,
  Stages.Comissão_Eleitoral,
  Stages.Homologação_das_Chapas,
  Stages.Campanha_Eleitoral,
  Stages.Votação,
  Stages.Posse,
] as const;

export const StagesEnumZod = z.enum(stages);

export type Stage = (typeof stages)[number];

export const RoleEnumZod = z.enum(roles);

export const TimestampsMetadata = z.object({
  created_at: z.date().nullable(),
  updated_at: z.date().nullable(),
  deleted_at: z.date().nullable(),
  disabled_at: z.date().nullable(),
});

export const SchoolSchema = z
  .object({
    id: z.string(),
    name: z
      .string()
      .nonempty("Campo Obrigatório")
      .transform((nome) => nome.trim()),
    city: z
      .string()
      .nonempty("Campo Obrigatório")
      // .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "O nome só pode conter letras")
      .transform((nome) => nome.trim()),
    status: z.boolean().default(true),
  })
  .merge(TimestampsMetadata);

export const SchoolCreateSchema = SchoolSchema.omit({
  id: true,
  status: true,

  created_at: true,
  disabled_at: true,
  updated_at: true,
  deleted_at: true,
});

const PatchSchoolSchema = SchoolCreateSchema.partial();
const SchoolListSchema = z.array(SchoolSchema);

export type School = z.infer<typeof SchoolSchema>;
export type SchoolCreate = z.infer<typeof SchoolCreateSchema>;
export type PatchSchool = z.infer<typeof PatchSchoolSchema>;
export type SchoolList = z.infer<typeof SchoolListSchema>;

export const InterlocutorSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    contact: z.string(),
    status: z.boolean().default(true),
  })
  .merge(TimestampsMetadata);

export const InterlocutorCreateSchema = InterlocutorSchema.omit({
  id: true,
  status: true,

  created_at: true,
  disabled_at: true,
  updated_at: true,
  deleted_at: true,
});

const InterlocutorListSchema = z.array(InterlocutorSchema);
const PatchInterlocutorSchema = InterlocutorCreateSchema.partial();

export type Interlocutor = z.infer<typeof InterlocutorSchema>;
export type InterlocutorList = z.infer<typeof InterlocutorListSchema>;
export type InterlocutorPatch = z.infer<typeof PatchInterlocutorSchema>;
export type InterlocutorCreate = z.infer<typeof InterlocutorCreateSchema>;

export const StudentSchema = z
  .object({
    id: z.string().min(6),
    registration: z.string(),
    name: z.string().min(1),
    contact: z.string(),
    email: z.string().email(),
    status: z.boolean(),
    series: z.string(),
    shift: z.enum(["matutino", "vespertino", "noturno", "integral"]),
    url_profile: z.string().default(""),
  })
  .merge(TimestampsMetadata);

export const StudentCreateSchema = StudentSchema.omit({
  id: true,
  status: true,

  created_at: true,
  disabled_at: true,
  updated_at: true,
  deleted_at: true,
});

const PatchStudentSchema = StudentCreateSchema.partial();
const StudentListSchema = z.array(StudentSchema);

export type Student = z.infer<typeof StudentSchema>;
export type StudentList = z.infer<typeof StudentListSchema>;
export type StudentPatch = z.infer<typeof PatchStudentSchema>;
export type StudentCreate = z.infer<typeof StudentCreateSchema>;

export const MemberBaseSchema = z
  .object({
    id: z.string().min(6),
    role: RoleEnumZod,
    status: z.boolean(),
    gremio_id: z.string().min(6),
    student_id: z.string().min(6),
  })
  .merge(TimestampsMetadata);

export const MemberCreateSchema = MemberBaseSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  disabled_at: true,
});

export const PatchMemberSchema = MemberCreateSchema.partial();

export const AllMemberSchema = z.array(MemberBaseSchema);

export const MemberWithStudentSchema = MemberBaseSchema.extend({
  student: StudentSchema,
});
export const AllMemberWithStudentsSchema = z.array(MemberWithStudentSchema);

export type Member = z.infer<typeof MemberBaseSchema>;
export type MemberWithStudent = z.infer<typeof MemberWithStudentSchema>;

export type MemberCreate = z.infer<typeof MemberCreateSchema>;
export type MemberPatch = z.infer<typeof PatchMemberSchema>;

export type MemberList = z.infer<typeof AllMemberSchema>;
export type MemberWithStudentList = z.infer<typeof AllMemberWithStudentsSchema>;

export const GremioBaseSchema = z
  .object({
    id: z.string().min(6),
    name: z.string().min(1, "Nome é obrigatório").default(faker.animal.cow()),
    status: z.boolean().default(true),
    url_profile: z
      .string()
      .url("URL inválida")
      .nullable()
      .optional()
      .default(faker.image.avatar()),
    url_folder: z
      .string()
      .url("URL inválida")
      .nullable()
      .optional()
      .default(faker.image.avatar()),
    validity_date: z
      .string()
      .refine((val) => moment(val).isValid(), "Data de vigência inválida")
      .transform((val) => moment(val).toISOString()),
    approval_date: z
      .string()
      .refine((val) => moment(val).isValid(), "Data de nomeação inválida")
      .transform((val) => moment(val).toISOString()),
    url_action_plan: z.string().url(),

    interlocutor_id: z.string().min(6),
    school_id: z.string().min(6),
  })
  .merge(TimestampsMetadata);

export const GremioCreateSchema = GremioBaseSchema.omit({
  id: true,

  created_at: true,
  disabled_at: true,
  updated_at: true,
  deleted_at: true,
});

export const PatchGremioSchema = GremioCreateSchema.partial();

export const AllGremioSchema = z.array(GremioBaseSchema);

export const GremioWithMember = GremioBaseSchema.omit({
  school_id: true,
  interlocutor_id: true,
}).extend({
  interlocutor: InterlocutorSchema,
  school: SchoolSchema,
  members: AllMemberWithStudentsSchema,
});

export const AllGremioWithMembersSchema = z.array(GremioWithMember);

export interface ResponseCreateGremio {
  gremio_id: string;
}

export type Gremio = z.infer<typeof GremioBaseSchema>;
export type GremioCreate = z.infer<typeof GremioCreateSchema>;

export type GremioWithMember = z.infer<typeof GremioWithMember>;

export type GremioPatch = z.infer<typeof PatchGremioSchema>;

export type GremioList = z.infer<typeof AllGremioSchema>;
export type GremioWithMembersList = z.infer<typeof AllGremioWithMembersSchema>;

export const GremioProcessRedefinitionStagesBaseSchema = z.object({
  gremio_process_id: z.string().min(6),
  stage: StagesEnumZod,
  status: z.boolean(),
  started_at: z
    .string()
    .refine((val) => moment(val).isValid(), "Data de inicio inválida")
    .transform((val) => moment(val).toISOString()),
  finished_at: z
    .string()
    .refine((val) => moment(val).isValid(), "Data de fim inválida")
    .transform((val) => moment(val).toISOString()),
  observation: z.string(),
});

export const GetGremioProcessRedefinitionStagesSchema = z
  .object({
    id: z.string().min(6),
    order: z.number(),
  })
  .merge(GremioProcessRedefinitionStagesBaseSchema)
  .merge(TimestampsMetadata);

export type ProcessRedefinitionStages = z.infer<
  typeof GetGremioProcessRedefinitionStagesSchema
>;
export type ProcessRedefinitionStagesCreate = z.infer<
  typeof GremioProcessRedefinitionStagesBaseSchema
>;

export const ProcessRedefinitionBaseSchema = z.object({
  gremio_id: z.string().min(6),
  status: z.boolean(),
  observation: z.string(),
  year: z.number().min(2000).max(2100),
});

export const ProcessRedefinitionPatchSchema =
  ProcessRedefinitionBaseSchema.partial();

export const ProcessRedefinitionViewSchema = z
  .object({
    id: z.string().min(6),
  })
  .merge(ProcessRedefinitionBaseSchema)
  .merge(TimestampsMetadata);

export const GetProcessRedefinitionWithStagesSchema = z
  .object({
    id: z.string().min(6),
    stages: z.array(GetGremioProcessRedefinitionStagesSchema).optional(),
  })
  .merge(ProcessRedefinitionBaseSchema)
  .merge(TimestampsMetadata);

export type ProcessRedefinition = z.infer<typeof ProcessRedefinitionViewSchema>;
export type ProcessRedefinitionCreate = z.infer<
  typeof ProcessRedefinitionBaseSchema
>;
export type ProcessRedefinitionPatch = z.infer<
  typeof ProcessRedefinitionPatchSchema
>;

export type ProcessRedefinitionWithStages = z.infer<
  typeof GetProcessRedefinitionWithStagesSchema
>;

export const MessageSchema = z.object({
  message: z.string(),
});

export const MessageWithIdSchema = z.object({
  message: z.string(),
  id: z.string().min(6),
});

export type Message = z.infer<typeof MessageSchema>;
export type MessageWithId = z.infer<typeof MessageWithIdSchema>;
