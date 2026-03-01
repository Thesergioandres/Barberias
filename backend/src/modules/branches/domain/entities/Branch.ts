type BranchProps = {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  phone?: string;
  active: boolean;
  createdAt: string;
};

export type BranchRecord = BranchProps;

export class Branch {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  phone?: string;
  active: boolean;
  createdAt: string;

  constructor(props: BranchProps) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.name = props.name;
    this.address = props.address;
    this.phone = props.phone;
    this.active = props.active;
    this.createdAt = props.createdAt;
  }
}
