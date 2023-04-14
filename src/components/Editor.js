import React, { useEffect, useRef} from 'react'
// import { Controlled as CodeMirror } from "react-codemirror2";
import Codemirror from 'codemirror';
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import '../App.css';
import ACTIONS from '../Actions';


const Editor = ({socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  // const [code, setCode] = useState("const a = 10;");

  useEffect(() =>{
    async function init()
    {
      editorRef.current = Codemirror.fromTextArea(document.getElementById('realtimeEditor'),{
        mode:{name : 'javascript', json:true},
        theme:'dracula',
        autoCloseTags:true,
        autoCloseBrackets : true,
        lineNumbers:true,
      });



      //adding a codemirror in built event 'change'
      editorRef.current.on('change', (instance, changes) =>
      {
        console.log("changes->",changes);
        //'+input' indicates that there has been a change by the user
        const {origin} = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if(origin!=='setValue')
        {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, 
            {
              roomId,
              code,
            })
        }
        console.log(code);
      });

      
      // editorRef.current.setValue(`S`);   
    }
    init();
  }, []);

  useEffect(() =>
  {
    if(socketRef.current)
    {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if(code!==null){
          editorRef.current.setValue(code);
        }
      });
    }
    return () =>
    {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    }
  }, [socketRef.current]);


  return (
   <textarea id = "realtimeEditor"></textarea>
  )
}

export default Editor
