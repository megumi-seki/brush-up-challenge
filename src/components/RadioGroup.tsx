type Option = { value: string; label: string };

type RadioGroupProps = {
  name: string;
  options: Option[];
  selectedValue: string;
  onChange: (selectedValue: string) => void;
  text?: string;
};

const RadioGroup = ({
  name,
  options,
  selectedValue,
  onChange,
  text,
}: RadioGroupProps) => (
  <div className="flex gap-learge align-baseline">
    {options.map((option) => (
      <label
        key={option.value}
        className={`radio-label${
          selectedValue === option.value ? " selected" : ""
        }`}
      >
        <input
          type="radio"
          name={name}
          value={option.value}
          checked={selectedValue === option.value}
          onChange={() => onChange(option.value)}
        />
        {option.label}
      </label>
    ))}
    {text && <span className="type-text">{text}</span>}
  </div>
);

export default RadioGroup;
