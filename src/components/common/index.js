/* This file allows all common components listed below to be imported into other files with one line.
   When creating a new common component, please add it below.
   
   Example from EventCheckIn.jsx: 
      import { MemberInfo, FormGroup, Button } from '../common';
          vs.
      import Button from '../common/Button';
      import MemberInfo from '../common/MemberInfo';
      import FormGroup from '../common/FormGroup';
   
   Note that we do not need to specify /index.js in the path above. 'index' is a special name that 
   node and webpack look for when resolving an absolute path that is a directory. See the following post for more 
   information: https://stackoverflow.com/a/35443250/6732128
*/

export {Button} from './Button';
export {MemberInfo} from './MemberInfo';
export {FormGroup} from './FormGroup';
