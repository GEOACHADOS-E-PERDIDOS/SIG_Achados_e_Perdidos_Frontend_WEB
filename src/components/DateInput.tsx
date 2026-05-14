// components/DataInput.tsx

import DatePicker from "react-datepicker";

import { ptBR } from "date-fns/locale";

import "react-datepicker/dist/react-datepicker.css";

import "../styles/DateInput.css"

type Props = {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
};

export default function DataInput({
  selected,
  onChange,
  placeholder = "Selecione uma data"
}: Props) {

  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      locale={ptBR}
      dateFormat="dd/MM/yyyy"
      placeholderText={placeholder}
      className="input-data"
      popperClassName="datepicker-popper"
    />
  );
}

