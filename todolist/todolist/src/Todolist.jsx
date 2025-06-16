import { useState } from "react";

function Todolist(){
    
    const [array,updatearray]=useState([]);
    const [inp,setinp]=useState("");
    
    function setting(e){
        setinp(e.target.value);
    }

    function addtask(){
        if(inp!==""){
            updatearray([...array,inp]);
            setinp("");
        }
    }
    
    function deletetask(indextoremove){
        const newarray= array.filter((currvalue,index)=> index!=indextoremove);
        updatearray(newarray);
    }
    function moveup(currindex){
        // then only able to move
        if(currindex-1>=0){
            const newarray=[...array];
            [newarray[currindex-1],newarray[currindex]]=[newarray[currindex],newarray[currindex-1]];
            updatearray(newarray);
        }
    }
    function movedown(currindex){
        let l=array.length;
        if(currindex+1<l){
            const newarray=[...array];
            [newarray[currindex+1],newarray[currindex]]=[newarray[currindex],newarray[currindex+1]];
            updatearray(newarray)
        }
    }
    return (
        <>
        <h1>To Do list</h1>
        <div>
        <input type="text" placeholder="add task here..." value={inp} onChange={setting}></input>
        <button onClick={addtask}>ADD✅</button>
        </div>
        <ol>
           {array.map((task,index) => 
            <li>
                {task} <button onClick={()=> deletetask(index)}>delete❌</button>
                <button onClick={()=>moveup(index)}>move up⬆️</button>
                <button onClick={()=>movedown(index)}>move down⬇️</button>
                <br />
                <br />
            </li>
            ) 
           } 
        </ol>
        </>
    );
}

export default Todolist