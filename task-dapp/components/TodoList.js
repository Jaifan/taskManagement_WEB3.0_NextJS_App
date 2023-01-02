import { useEffect, useState } from "react"
import {useMoralis, useWeb3Contract} from "react-moralis"
import {useNotification} from "web3uikit"
import {contractAddress,abi} from "../constant"
const dTaskList = [
    "Add money",
    "Everything OK",
    "All is Well",
    "Web3.0 Applications"
]
export default function TodoList () {
    const [taskName, setTaskName] = useState("")
    const [taskList, setTaskList] = useState([])
    const {Moralis,isWeb3Enabled, chainId, account} = useMoralis()
    const dispatch = useNotification()

    const chainIdNumber = parseInt(chainId)
    const todoListAddress = chainIdNumber in contractAddress ? contractAddress[chainIdNumber][0] : null
    var taskIndex = 1
    var targetIndex = 0
    const {
        runContractFunction: addTask,
        data: enterTxResponse,
        isLoading,
        isFetching
    } = useWeb3Contract({
            abi: abi.abi,
            contractAddress: todoListAddress,
            functionName: "addTask",
            params: { taskName: taskName }
        })
    
    const {runContractFunction: getAddressTaskList} = useWeb3Contract({
        abi: abi.abi,
        contractAddress : todoListAddress,
        functionName: "getAddressTaskList",
        params: {user : account}
    })

    const {runContractFunction: editTaskStatus,
    data : StatusChangeTxResponse} = useWeb3Contract({
        abi: abi.abi,
        contractAddress : todoListAddress,
        functionName: "editTaskStatus",
        params: {taskIndex}
    })

    const {runContractFunction: taskDelete,
        data : deleteTxResponse} = useWeb3Contract({
            abi: abi.abi,
            contractAddress : todoListAddress,
            functionName: "taskDelete",
            params: {taskIndex}
        })
    
    const handleChangeTask = (event) => {
        setTaskName(event.target.value)
    } 
    const handleNewNotification=()=>{
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Task Write Change",
            position: "topR",
            icon: ""
        })
    }
    const handleSuccess = async(tx)=> {
        try {
            await tx.wait(1)
            updateTaskList()
            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }
    }

    const handleStatusChange = async(index) => {
        targetIndex = index-1
        await editTaskStatus({
            params: {taskIndex: targetIndex},
            onSuccess: handleSuccess,
            onError: (err)=> console.log(err)
        })
    }

    const handleDeleteTask = async(index) => {
        targetIndex = index-1
        console.log(targetIndex)
        await taskDelete({
            params: {taskIndex: targetIndex},
            onSuccess: handleSuccess,
            onError: (err)=> console.log(err)
        })
    }

    const handleTaskSubmit = async(event) => {
        event.preventDefault()
        await addTask({
            onSuccess: handleSuccess,
            onError: (er)=> console.log(er)
        })
    }
    const List =({item,taskIndex})=> (
        <div>
        <h4>Task Number : {taskIndex}</h4>
        <h3>{item.taskName}</h3>
        <p>Status : {item.taskStatus ===0 ? "Pending" : "Completed"}</p>
        {item.taskStatus===0 ? <button onClick={()=> handleStatusChange(taskIndex)}>Make Complete</button>:<button onClick={()=> handleStatusChange(taskIndex)}>Make Pending</button>}
        <button onClick={()=> handleDeleteTask(taskIndex)}>Delete Task</button>

       </div>
    )
    async function updateTaskList () {
        const tasks = await getAddressTaskList()
        setTaskList(tasks)
    } 
    useEffect(()=>{
        if(isWeb3Enabled){
            updateTaskList()
        }
    },[isWeb3Enabled])

    return (
        <div>
            <div>
                <form onSubmit={handleTaskSubmit}>
                    <label>Enter Your Task Name</label><br/>
                    <input type="text" name="taskName" onChange={handleChangeTask}/>
                    {isFetching || isLoading ? (<input type="submit" value="Add Task" disabled/>) 
                    : (<input type="submit" value="Add Task"/>)}
                </form>
            </div>

            <div>
                <h2>Task Name List</h2>
               {taskList.map((item, i)=> (<List key={i} item ={item} taskIndex = {taskIndex++}/>))}
            </div>

        
        </div>
    )
}