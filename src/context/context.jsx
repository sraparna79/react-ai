import { createContext, use, useEffect, useState } from "react";
import runChat from "../config/gemini";

// Create context
export const Context = createContext();

const ContextProvider = (props) => {
    const[input,setInput] = useState("");
    const [recentPrompt,setRecentPrompt] = useState("");
    const [prevPrompts,setPrevPrompts] = useState([]);
    const [showResult,setShowResult] = useState(false);
    const[loading,setLoading] = useState(false);
    const [resultData,setResultData] = useState("");

    const dealyPara = (index,nextWord) => {
        setTimeout(function(){
            setResultData(prev=>prev+nextWord);
        },75*index)

    }

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }

  // Define async function
  const onSent = async (prompt) => {

    setResultData("")
    setLoading(true)
    setShowResult(true)
    let response; 
    if (prompt !== undefined){
        response = await runChat(prompt);
        setRecentPrompt(prompt)
    }
    else
    {
        setPrevPrompts(prev=>[...prev,input])
        setRecentPrompt(input)
        response = await runChat(input)
    }
    
    
    let responseArray = response.split("**");
    let newResponse = "";
    for(let i =0 ; i < responseArray.length; i++){
        if(i === 0 || i%2 !== 1){
            newResponse += responseArray[i];
        }
        else{
            newResponse += "<b>"+responseArray[i]+"</b>";
        }
    }
    let newResponse2 = newResponse.split("*").join("<br /")
    let newResponseArray = newResponse2.split(" ");
    for(let i=0; i<newResponseArray.length; i++)
    {
        const nextWord = newResponseArray[i];
        dealyPara(i,nextWord+" ")
    }
    setLoading(false)
    setInput("")
  }



//   // Run once on mount (for testing)
//   useEffect(() => {
//     onSent("What is React JS?");
//   }, []);

  // Provide the function to the context
  const contextValue = {
    prevPrompts,setPrevPrompts,onSent,setRecentPrompt,
    showResult,loading,resultData,input,setInput,newChat
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
