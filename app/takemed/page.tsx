'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { url_endpoint } from "@/config"
import axios from "axios"
import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import toast, { Toaster } from "react-hot-toast"
import { useRouter } from "next/navigation"

const Takemed = () => {

    let [take, setTake] = useState('')
    let [add, setAdd] = useState('')

    let [me, setMe] = useState<any>(null)
    let [detailtake, setDetailTake] = useState<any>(null)

    let [loading, setLoading] = useState(true)

    let navigate = useRouter()

    const takemedInsert = () => {
        let decoded = localStorage.getItem("token")

        if (decoded) {
            let dat: any = jwtDecode(decoded)

            axios.post(`${url_endpoint}/takemedinfo`, {
                takemed: take,
                addition: add,
                userId: dat.id
            }).then((res) => {
                console.log(res.data)
                if(res.data.status == 200){
                    window.location.reload()
                }
            })
        }

    }

    let init = async() => {
        let token = await localStorage.getItem("token")

        if (token) {
            let decoded: any = await jwtDecode(token)

            setMe(decoded)

            await axios.get(`${url_endpoint}/takemed_detail/${decoded.id}`).then((res) => {
                setDetailTake(res.data.user)
                console.log(res.data)
            })
        }else{
            navigate.push("/")
        }
    }
    

    useEffect(() => {
        setLoading(true)
        init()
        setLoading(false)
    }, [])

    if(loading){
        return null
    }

    return (
        <div className="flex gap-3 justify-center items-center h-[100dvh] flex-col">

            <div className="">
                <p>คุณ : {me ? me.name : null}</p>
            </div>





            <div className="flex gap-2 mt-2 mb-2">
                <Button className="w-30" variant={'outline'} onClick={() => {
                    navigate.push("/behave")
                }}>พฤติกรรม</Button>
                <Button className="w-30" variant={'outline'} onClick={() => {
                    navigate.push("/takemed")
                }}>บันทึกการกินยา</Button>
            </div>

            <p>แบบบันทึกการกินยาสำหรับคุณแม่🤰</p>


            {detailtake && detailtake.length > 0 ? <div>
                <p className="text-green-700">วันนี้คุณได้บันทึกการกินยาแล้ว</p>
            </div> : <div className="flex flex-col gap-3">
                <Select onValueChange={(e) => {
                    console.log(e)
                    setTake(e)
                }}>
                    <SelectTrigger className="w-50">
                        <SelectValue placeholder="สถานะ"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="กินยาแล้ว">กินยาแล้ว</SelectItem>
                        <SelectItem value="ยังไม่ได้กิน">ยังไม่ได้กิน</SelectItem>
                    </SelectContent>
                </Select>
                <Input onChange={(e) => {
                    setAdd(e.target.value)
                }} className="w-50" placeholder="อาการข้างเคียง (หากมี)"></Input>
                <Button onClick={() => {
                    if (take) {
                        toast.loading("กำลังบันทึกการกินยา", { duration: 1500 })

                        setTimeout(() => {
                            toast.success("บันทึกการกินยาสำเร็จ")
                            takemedInsert()
                        }, 1500)

                    } else {
                        toast.error("กรุณาเลือกสถานะก่อน!")
                    }
                }} className="cursor-pointer">บันทึก</Button></div>}

            <Toaster position="bottom-center" />
        </div>
    )
}

export default Takemed