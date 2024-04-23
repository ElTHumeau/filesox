import {useDropzone} from "react-dropzone";
import {ReactNode, useCallback} from "react";
import './dropzone.css';
import {useFileStore} from "../../stores/useFileStore.ts";

export function Dropzone({ children} : {children: ReactNode}) {
  const {setFiles} = useFileStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, isDragActive } = useDropzone({ onDrop });

  return (
      <div {...getRootProps()} className={`relative cols-span-3 px-6 h-full`}>

        {children}

        <div className={`dropzone__file ${isDragActive ? 'active' : ''}`}></div>
      </div>
  );
}