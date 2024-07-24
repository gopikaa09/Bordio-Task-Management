// import store from "@/store";
// import ConfirmDialog, { ConfirmDialogProps } from "../shared/ConfirmDialog";
// import { useSelector } from "react-redux";
// import { createContext, ReactElement, useCallback, useContext, useRef, useState } from "react";


// export interface CommonDialgueProps extends ConfirmDialogProps {
//   body: string | undefined
// }

// const initialState: CommonDialgueProps = {
//   type: 'warning',
//   title: "Are you sure you want to proceed ?",
//   cancelText: 'Cancel',
//   confirmText: 'Confirm',
//   isOpen: false,
//   confirmButton: true,
//   body: undefined

// }

// const CommonDialog = createContext(initialState)
// export let getConfirmation: (props: Partial<ConfirmDialogProps>) => Promise<boolean>;


// export const CommonDialogProvider = ({ children }: { children: any }) => {
//   const [state, setState] = useState(initialState);
//   const fn = useRef()

//   const confirm = useCallback(
//     (data: ConfirmDialogProps) => {
//       return new Promise((resolve) => {
//         setState({ ...data, isOpen: true });
//         fn.current = (choice: Partial<CommonDialgueProps>) => {
//           resolve(choice);
//           setState({ ...data, isOpen: false });
//         };
//       });
//     },
//     [setState]
//   );
//   getConfirmation = confirm

//   return (
//     <CommonDialog.Provider value={confirm}>
//       {children}
//       <ConfirmDialog
//         type={state.type}
//         title={state.title}
//         isOpen={state.isOpen}
//         confirmText={state?.confirmButton && state.confirmText}
//         confirmButtonColor={state.confirmButtonColor}
//         onConfirm={() => fn.current(true)}
//         onCancel={() => fn.current(false)}
//         onClose={() => fn.current(false)}
//         bodyOpenClassName="overflow-hidden"
//       >
//         {state.body}
//       </ConfirmDialog>
//     </CommonDialog.Provider>

//   )
// }

// export default function useConfirm() {
//   return useContext(CommonDialog)
// }