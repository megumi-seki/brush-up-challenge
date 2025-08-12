type Option = { value: string; label: string };

type RadioGroupProps = {
  name: string;
  options: Option[];
  selectedValue: string;
  onChange: (selectedValue: string) => void;
};

const RadioGroup = ({
  name,
  options,
  selectedValue,
  onChange,
}: RadioGroupProps) => (
  <div className="flex justify-around">
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
  </div>
);

export default RadioGroup;
