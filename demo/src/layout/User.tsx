import React from 'react';
import './user.less';

const UserLayout: React.FC = props => {
  const { children } = props;
  return (
    <div className="RA-UserSkeleton">
      <div>{children}</div>
    </div>
  );
};
export default UserLayout;
