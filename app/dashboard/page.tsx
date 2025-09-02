'use client'

import { url_endpoint } from "@/config"
import axios from "axios"
import { useEffect, useState } from "react"

const Dashboard = () => {

    let [users, setUsers] = useState<any>(null)
    // let [select, setSelect] = useSTate
    let [modal, setModal] = useState(false)

    let [behaves, setBehaves] = useState<any>(null)
    let [takemed, setTakemed] = useState<any>(null)

    const init = () => {
        axios.get(`${url_endpoint}/all_information_details`).then((res) => {
            console.log(res.data)
            setUsers(res.data)
        })
    }

    useEffect(() => {
        init()
    }, [])

    useEffect(() => {
        if (modal) {
            document.documentElement.classList.add("overflow-x-hidden");
            document.body.classList.add("overflow-x-hidden");
        } else {
            document.documentElement.classList.remove("overflow-x-hidden");
            document.body.classList.remove("overflow-x-hidden");
        }
    }, [modal]);


    return (
        <div className="p-5">

            <p className="mb-2">ฐานข้อมูล</p>

            {modal ? <div onClick={(e) => {
                if (e.target == e.currentTarget) {
                    setModal(false)
                    setBehaves(null)
                    setTakemed(null)
                }
            }} className="w-[100dvw] h-full p-5 bg-black/50 fixed top-0 left-0 gap-2 flex flex-col">
                <div className="w-full h-[20dvh] rounded-lg bg-white overflow-scroll shadow p-5">
                    <p className="text-center">ฐานข้อมูลพฤติกรรม</p>
                    <table className="w-full">
                        <thead className="border-b-1 border-black">
                            <tr>
                                {/* <td>id</td> */}
                                {/* <td>userId</td> */}
                                {/* <td>answers</td> */}
                                <td>date</td>
                                <td>score</td>
                                {/* <td>timestamp</td> */}
                            </tr>
                        </thead>
                        <tbody>
                            {behaves.map((item: any) => {
                                console.log(item)
                                return (
                                    <tr>
                                        {/* <td>{item.id}</td> */}
                                        {/* <td>{item.userId}</td> */}
                                        {/* <td>{item.answers}</td> */}
                                        <td>{item.date}</td>
                                        <td>{item.score}</td>
                                        {/* <td>{item.timestamp}</td> */}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="w-full h-[20dvh] rounded-lg bg-white shadow overflow-scroll p-5">
                    <p className="text-center">ฐานข้อมูลการกินยา</p>
                    <table className="w-full">
                        <thead className="border-b-1 border-black">
                            <tr>
                                {/* <td>tid</td> */}
                                {/* <td>userId</td> */}
                                <td>date</td>
                                <td>takemed</td>
                                <td>addition</td>
                            </tr>
                        </thead>
                        <tbody>
                            {takemed && takemed.length > 0 ? takemed.map((item: any) => {
                                console.log(item)
                                return (
                                    <tr>
                                        {/* <td>{item.id}</td> */}
                                        {/* <td>{item.userId}</td> */}
                                        <td>{item.date}</td>
                                        <td>{item.takemed ? item.takemed : '-'}</td>
                                        <td>{item.addition ? item.addition : '-'}</td>
                                    </tr>
                                )
                            }) : null}
                        </tbody>
                    </table>
                </div>
            </div> : null}

            <table className="w-[500dvw] text-center">
                <thead className="bg-gray-100">
                    <tr>
                        <td>ID</td>
                        <td>Name</td>
                        <td>Age</td>
                        <td>Abort</td>
                        <td>Genre</td>
                        <td>Graduation</td>
                        <td>Income</td>
                        <td>Job</td>
                        <td>Marry</td>
                        <td>Pregage</td>
                        <td>Preghis</td>
                        <td>Line_userId</td>
                        <td>Done_day</td>
                    </tr>
                </thead>
                <tbody>
                    {users && users.length > 0 ? users.map((item: any, index: number) => {
                        return (
                            <tr className={`${index % 2 == 0 ? 'bg-slate-200' : 'bg-white'}`} onClick={() => {
                                setModal(true)
                                console.log(item)
                                setBehaves(item.behaves)
                                setTakemed(item.takemeds)
                            }}>
                                <td className="h-[50px]">{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.age}</td>
                                <td>{item.abort}</td>
                                <td>{item.genre}</td>
                                <td>{item.graduation}</td>
                                <td>{item.income}</td>
                                <td>{item.job}</td>
                                <td>{item.marry}</td>
                                <td>{item.pregage}</td>
                                <td>{item.preghis}</td>
                                <td>{item.line_userId}</td>
                                <td>{item.done_day}</td>
                            </tr>
                        )
                    }) : null}
                </tbody>
            </table>
        </div>
    )
}

export default Dashboard