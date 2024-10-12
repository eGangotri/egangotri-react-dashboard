
export type ItemToolTipPropsType = {
    input: string;
    alphabetCount?: number;
    reverse?: boolean;
    url?: boolean;
    reactComponent?: ReactElement
    noEllipsis?:boolean
  };
  
  export type ItemToolTipLabelPropsType = {
    input: string;
    url?: boolean;
    withEllipsis?:string | number,
    noEllipsis?:boolean
  };