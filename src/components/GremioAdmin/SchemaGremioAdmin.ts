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

export const RoleEnumZod = z.enum(roles);

export const TimestampFields = {
  created_at: z.date().nullable(),
  updated_at: z.date().nullable(),
  deleted_at: z.date().nullable(),
  disabled_at: z.date().nullable(),
};

export const SchoolSchema = z.object({
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

  ...TimestampFields
});

export const SchoolCreateSchema = SchoolSchema.omit({
  id: true,
  status: true,

  created_at: true,
  disabled_at: true,
  updated_at: true,
  deleted_at: true,
});

export type School = z.infer<typeof SchoolSchema>;
export type SchoolCreate = z.infer<typeof SchoolCreateSchema>;

export const InterlocutorSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  contact: z.string(),
  status: z.boolean().default(true),

  ...TimestampFields
});

export const InterlocutorCreateSchema = InterlocutorSchema.omit({
  id: true,
  status: true,

  created_at: true,
  disabled_at: true,
  updated_at: true,
  deleted_at: true,
});

export type Interlocutor = z.infer<typeof InterlocutorSchema>;
export type InterlocutorCreate = z.infer<typeof InterlocutorCreateSchema>;

export const StudentSchema = z.object({
  id: z.string().min(6),
  registration: z.string(),
  name: z.string().min(1),
  contact: z.string(),
  email: z.string().email(),
  status: z.boolean(),
  series: z.string(),
  shift: z.enum(["matutino", "vespertino", "noturno", "integral"]),
  url_profile: z.string().default(""),

  ...TimestampFields
});

export const StudentCreateSchema = StudentSchema.omit({
  id: true,
  status: true,

  created_at: true,
  disabled_at: true,
  updated_at: true,
  deleted_at: true,
});

export type Student = z.infer<typeof StudentSchema>;
export type StudentCreate = z.infer<typeof StudentCreateSchema>;

export const MemberSchema = z.object({
  id: z.string().min(6),
  student_id: z.string(),
  gremio_id: z.string(),
  role: z.string(),
  status: z.boolean().default(true),

  ...TimestampFields
});

export const MemberViewSchema = z.object({
  id: z.string().min(6),
  gremio_id: z.string().min(6),
  role: RoleEnumZod,
  status: z.boolean(),
  student: StudentSchema,

  ...TimestampFields
});

export const MemberCreateSchema = MemberSchema.omit({
  id: true,
  status: true,

  created_at: true,
  disabled_at: true,
  updated_at: true,
  deleted_at: true,
});

export type Member = z.infer<typeof MemberSchema>;
export type MemberCreate = z.infer<typeof MemberCreateSchema>;
export type MemberView = z.infer<typeof MemberViewSchema>;

export const MemberViewListSchema = z.array(MemberViewSchema);
export type MemberViewList = z.infer<typeof MemberViewListSchema>;


export const GremioBaseSchema = {
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
    .refine(val => moment(val).isValid(), "Data de vigência inválida")
    .transform(val => moment(val).toISOString()),
  approval_date: z
    .string()
    .refine(val => moment(val).isValid(), "Data de nomeação inválida")
    .transform(val => moment(val).toISOString()),
}
export const GremioCreateSchema = z.object({
  ...GremioBaseSchema,
  school_id: z.string().min(6, "ID da escola inválido").default(""),
  interlocutor_id: z.string().min(6, "ID do interlocutor inválido").default(""),
});

export const GremioViewSchema = z.object({ 
  id: z.string().min(6),
  ...GremioBaseSchema, 
  school: SchoolSchema,
  interlocutor: InterlocutorSchema,
  members: z.array(MemberViewSchema),

  ...TimestampFields

})

export interface ResponseCreateGremio {
  gremio_id: string;
}
 
export type Gremio = z.infer<typeof GremioViewSchema>;
export type GremioCreate = z.infer<typeof GremioCreateSchema>;


export const MessageSchema = z.object({
  message: z.string()
})

export type Message = z.infer<typeof MessageSchema>;