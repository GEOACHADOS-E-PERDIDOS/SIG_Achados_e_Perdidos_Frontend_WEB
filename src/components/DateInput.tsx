
import DatePicker from "react-datepicker";
import { ptBR, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";

import "react-datepicker/dist/react-datepicker.css";
import "../styles/DateInput.css";

type Props = {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
};

export default function DataInput({
  selected,
  onChange,
  placeholder,
}: Props) {
  const { t, i18n } = useTranslation();

  const idiomaIngles = i18n.language === "en-US";

  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      locale={idiomaIngles ? enUS : ptBR}
      dateFormat={idiomaIngles ? "MM/dd/yyyy" : "dd/MM/yyyy"}
      placeholderText={
        placeholder || t("dateInput.placeholder")
      }
      className="input-data"
      popperClassName="datepicker-popper"
    />
  );
}
