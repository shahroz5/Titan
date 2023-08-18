export class SelectOption {
  label: string;
  value: string;
  foreignKey: string;
  selectedKey: string;

  constructor(
    label: string,
    value: string,
    foreignKey?: string,
    selectedKey?: string
  ) {
    this.label = label;
    this.value = value;
    this.foreignKey = foreignKey;
    this.selectedKey = selectedKey;
  }
}
