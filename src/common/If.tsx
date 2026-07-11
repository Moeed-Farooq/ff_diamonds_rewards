import React, {ReactNode} from 'react';

interface ifProps {
  condition: any;
  children: ReactNode;
  elseComp?: ReactNode;
}

const If: React.FC<ifProps> = props => {
  const {condition, children, elseComp} = props;
  if (condition) {
    return children;
  } else {
    return elseComp ? elseComp : null;
  }
};

export default If;
