import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import SaveIcon from "@mui/icons-material/Save";
import { z } from "zod";
import { useState } from "react";
import axios from "axios";

export default function FormsDocument() {
  const apiUrl = import.meta.env.VITE_BACK_END_URL as string;

  const formSchema = z.object({
    nomeCompleto: z
      .string()
      .nonempty("Campo Obrigatório")
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "O nome só pode conter letras")
      .transform((nome) => nome.trim()) // Remove espaços extras no começo e no final
      .refine(
        (nome) =>
          nome.split(/\s+/).filter((palavra) => palavra.length > 0).length >= 2,
        {
          message: "O nome deve ter pelo menos duas palavras completas",
        }
      ),
    nomeDaMae: z
      .string()
      .nonempty("Campo Obrigatório")
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "O nome só pode conter letras")
      .transform((nome) => nome.trim()) // Remove espaços extras no começo e no final
      .refine(
        (nome) =>
          nome.split(/\s+/).filter((palavra) => palavra.length > 0).length >= 2,
        {
          message: "O nome deve ter pelo menos duas palavras completas",
        }
      ),
    nomeEscolaExtinta: z
      .string()
      .nonempty("Campo Obrigatório")
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "O nome só pode conter letras")
      .transform((nome) => nome.trim()) // Remove espaços extras no começo e no final
      .refine(
        (nome) =>
          nome.split(/\s+/).filter((palavra) => palavra.length > 0).length >= 1,
        {
          message: "O nome deve ter pelo menos uma palavra completa",
        }
      ),
    municipioEscolaExtinta: z
      .string()
      .nonempty("Campo Obrigatório")
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "O nome só pode conter letras")
      .transform((nome) => nome.trim()) // Remove espaços extras no começo e no final
      .refine(
        (nome) =>
          nome.split(/\s+/).filter((palavra) => palavra.length > 0).length >= 1,
        {
          message: "Escreva pelo menos uma palavra",
        }
      ),
    anoConclusao: z.string().regex(/^\d{4}$/, "Ano inválido"),
    modalidadeEnsino: z.string().min(1, "Selecione a modalidade de ensino"),
    modalidadeSolicitada: z
      .string()
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "O modalidade só pode conter letras")
      .transform((nome) => nome.trim())
      .optional(),
    funcionario: z.string().nonempty("Selecione um funcionario"),
    status: z.string().nonempty("Selecione um Status"),
    tipoDocumento: z.string().nonempty("Selecione um documento"),
    via: z.string().nonempty("Selecione a Via"),
    cpf: z
      .string()
      .nonempty("O CPF não pode ser vazio")
      .refine((cpf) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf), {
        message: "O CPF formato: 000.000.000-00",
      }),
    numeroRg: z
      .string()
      .nonempty("Campo Obrigatório")
      .regex(/^\d+$/, "O RG deve conter apenas números")
      .transform((rg) => rg.trim()),
    orgaoExpedidorRg: z
      .string()
      .nonempty("Campo Obrigatório")
      .transform((nome) => nome.trim()) // Remove espaços extras no começo e no final
      .refine(
        (nome) =>
          nome.split(/\s+/).filter((palavra) => palavra.length > 0).length >= 1,
        {
          message: "Escreva pelo menos uma palavra",
        }
      ),
    naturalidade: z
      .string()
      .nonempty("Campo Obrigatório")
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "O nome só pode conter letras")
      .transform((nome) => nome.trim()) // Remove espaços extras no começo e no final
      .refine(
        (nome) =>
          nome.split(/\s+/).filter((palavra) => palavra.length > 0).length >= 1,
        {
          message: "Escreva pelo menos uma palavra",
        }
      ),
    email: z.string().nonempty("Campo Obrigatório").email("E-mail inválido"),
    telefoneContato: z.string().regex(/^\d{11}$/, "Telefone inválido"),
  });

  const [loading, setLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });


  const selectedModalidade = watch("modalidadeEnsino");

  const handleDataDocument = async (data: any) => {
    setLoading(true);
    try {
      const paramsUrl = {
        action: "addNewDocument",
        ...data,
        motivo: "",
        rgFrenteVerso: "",
        comprovanteEndereco: "",
      };

      console.log("addNewDocument", paramsUrl);
      const response = await axios.get(apiUrl, { params: paramsUrl });
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao adicionar documento:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-12 gap-2 ">
      <Divider className="col-span-12 !mt-4">Sobre o Solicitante</Divider>
      <TextField
        size="small"
        required
        className="col-span-12"
        label="Nome Completo"
        variant="outlined"
        {...register("nomeCompleto")}
        error={!!errors.nomeCompleto}
        helperText={errors.nomeCompleto?.message}
      />
      <TextField
        size="small"
        required
        className="col-span-12"
        label="Nome da Mãe"
        variant="outlined"
        {...register("nomeDaMae")}
        error={!!errors.nomeDaMae}
        helperText={errors.nomeDaMae?.message}
      />

      <TextField
        size="small"
        required
        className="col-span-6"
        label="CPF"
        placeholder="ex: "
        variant="outlined"
        {...register("cpf")}
        error={!!errors.cpf}
        helperText={errors.cpf?.message}
      />
      <TextField
        size="small"
        required
        className="col-span-6"
        label="Numero do RG"
        variant="outlined"
        {...register("numeroRg")}
        error={!!errors.numeroRg}
        helperText={errors.numeroRg?.message}
      />

      <TextField
        size="small"
        required
        className="col-span-6"
        label="Orgão Expeditor do RG"
        variant="outlined"
        {...register("orgaoExpedidorRg")}
        error={!!errors.orgaoExpedidorRg}
        helperText={errors.orgaoExpedidorRg?.message}
      />
      <TextField
        required
        size="small"
        className="col-span-6"
        label="Naturalidade"
        placeholder="A Cidade que nasceu"
        variant="outlined"
        {...register("naturalidade")}
        error={!!errors.naturalidade}
        helperText={errors.naturalidade?.message}
      />

      <TextField
        required
        size="small"
        className="col-span-6"
        label="E-mail"
        variant="outlined"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        required
        size="small"
        className="col-span-6"
        label="Telefone para Contato"
        placeholder="ex: 65996635840"
        variant="outlined"
        {...register("telefoneContato")}
        error={!!errors.telefoneContato}
        helperText={errors.telefoneContato?.message}
      />

      <Divider className="col-span-12 !mt-4">
        Sobre o Documento Solicitado
      </Divider>

      <TextField
        required
        size="small"
        className="col-span-6"
        label="Nome da Escola Extinta"
        variant="outlined"
        {...register("nomeEscolaExtinta")}
        error={!!errors.nomeEscolaExtinta}
        helperText={errors.nomeEscolaExtinta?.message}
      />

      <TextField
        required
        size="small"
        className="col-span-6"
        label="Município da Escola Extinta"
        variant="outlined"
        {...register("municipioEscolaExtinta")}
        error={!!errors.municipioEscolaExtinta}
        helperText={errors.municipioEscolaExtinta?.message}
      />

      <FormControl
        required
        size="small"
        variant="outlined"
        className="col-span-6"
        fullWidth
        error={!!errors.modalidadeEnsino}
      >
        <InputLabel>Modalidade de Ensino</InputLabel>
        <Controller
          name="modalidadeEnsino"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select
              {...field}
              labelId="modalidade-label"
              label="modalidade de Ensino"
              onChange={(event) => field.onChange(event.target.value)}
            >
              <MenuItem value="" disabled>
                Selecione...
              </MenuItem>
              <MenuItem value="Ensino Fundamental">Ensino Fundamental</MenuItem>
              <MenuItem value="Ensino Médio">Ensino Médio</MenuItem>
              <MenuItem value="EJA">EJA</MenuItem>
              <MenuItem value="ENCCEJA (até 2020)">ENCCEJA (até 2020)</MenuItem>
              <MenuItem value="Exame Certificador de EJA">
                Exame Certificador de EJA
              </MenuItem>
              <MenuItem value="ENEM (até 2016)">ENEM (até 2016)</MenuItem>
              <MenuItem value="Outros">Outros</MenuItem>
            </Select>
          )}
        />
        <FormHelperText>{errors.modalidadeEnsino?.message}</FormHelperText>
      </FormControl>

      <FormControl
        required
        size="small"
        variant="outlined"
        className="col-span-6"
        fullWidth
        error={!!errors.tipoDocumento}
      >
        <InputLabel>Tipo de Documento</InputLabel>
        <Controller
          name="tipoDocumento"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select {...field} label="Tipo de Documento">
              <MenuItem value="" disabled>
                Selecione...
              </MenuItem>
              <MenuItem value="Histórico">Histórico</MenuItem>
              <MenuItem value="Certificado">Certificado</MenuItem>
              <MenuItem value="Declaração">Declaração</MenuItem>
              <MenuItem value="Atestado">Atestado</MenuItem>
            </Select>
          )}
        />
        <FormHelperText>{errors.tipoDocumento?.message}</FormHelperText>
      </FormControl>

      {selectedModalidade === "Outros" && (
        <TextField
          required
          size="small"
          className="col-span-12"
          label="Modalidade Solicitada (Outros)"
          variant="outlined"
          {...register("modalidadeSolicitada")}
          error={!!errors.modalidadeSolicitada}
          helperText={errors.modalidadeSolicitada?.message}
        />
      )}

      <TextField
        size="small"
        className="col-span-6"
        label="Ano de Conclusão"
        variant="outlined"
        {...register("anoConclusao")}
        error={!!errors.anoConclusao}
        helperText={errors.anoConclusao?.message}
      />

      <FormControl
        required
        size="small"
        variant="outlined"
        className="col-span-6"
        fullWidth
        error={!!errors.via}
      >
        <InputLabel>Via</InputLabel>
        <Controller
          name="via"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select {...field} label="Via">
              <MenuItem value="" disabled>
                Selecione...
              </MenuItem>
              <MenuItem value="1° Via">1° Via</MenuItem>
              <MenuItem value="2° Via">2° Via</MenuItem>
            </Select>
          )}
        />
        <FormHelperText>{errors.via?.message}</FormHelperText>
      </FormControl>

      <Divider className="col-span-12 !mt-4">Status da Solicitação</Divider>

      <FormControl
        required
        size="small"
        variant="outlined"
        className="col-span-6"
        fullWidth
        error={!!errors.funcionario}
      >
        <InputLabel>Funcionário</InputLabel>
        <Controller
          name="funcionario"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select {...field} label="Funcionário">
              <MenuItem value="" disabled>
                Selecione...
              </MenuItem>
              <MenuItem value="Graciane">Graciane</MenuItem>
              <MenuItem value="Carmelito">Carmelito</MenuItem>
              <MenuItem value="Luander">Luander</MenuItem>
            </Select>
          )}
        />
        <FormHelperText>{errors.funcionario?.message}</FormHelperText>
      </FormControl>

      <FormControl
        size="small"
        variant="outlined"
        className="col-span-6"
        disabled
        fullWidth
        error={!!errors.status}
      >
        <InputLabel>Status</InputLabel>
        <Controller
          name="status"
          control={control}
          defaultValue="in_service"
          render={({ field }) => (
            <Select {...field} label="Status">
              {/* <MenuItem value="" >
                  Selecione...
                </MenuItem> */}
              <MenuItem disabled value="in_service">
                Em Atendimento
              </MenuItem>
              {/* <MenuItem value="denied">Negado</MenuItem>
                <MenuItem value="delivery">Liberado</MenuItem>
                <MenuItem value="finished">Finalizado</MenuItem> */}
            </Select>
          )}
        />
        <FormHelperText>{errors.status?.message}</FormHelperText>
      </FormControl>

      <div className="col-span-12 w-full flex items-center justify-end gap-3">
        <Button
          onClick={handleSubmit(handleDataDocument)}
          type="submit"
          variant="contained"
          color="primary"
          startIcon={
            loading ? (
              <DataSaverOffIcon className="animate-spin" />
            ) : (
              <SaveIcon />
            )
          }
        >
          Enviar
        </Button>
      </div>
    </div>
  );
}
