'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { url_endpoint } from "@/config"
import axios from "axios"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { jwtDecode } from 'jwt-decode'
import { useRouter } from "next/navigation"

const CustomRadio = ({ value, index }: { value: string, index: number }) => {
    return (
        <div className="flex items-center space-x-2">
            <RadioGroupItem className="cursor-pointer" value={`${value}`} id={`${value}${index}`} />
            <Label className="cursor-pointer" htmlFor={`${value}${index}`}>{value.split('-')[0]}</Label>
        </div>
    )
}

const Behave = () => {

    let [current, setCurrent] = useState(1)
    let [progressCount, setProgressCount] = useState(0)

    let [me, setMe] = useState<any>(null)
    let [behave, setBehave] = useState<any>(null)
    let [loading, setLoading] = useState(true)

    let navigate = useRouter()

    let quiz = [
        {
            id: 1,
            question: '1. วันนี้ท่านรับประทานอาหารพวกเนื้อสัตว์ ได้แก่ เนื้อหมู เนื้อไก่ เนื้อแดง ปลา หอย กุ้ง ปริมาณเท่าไร',
            ans1: { title: 'มากกว่า 12 ช้อนกินข้าว', point: 4 },
            ans2: { title: 'ประมาณ 10-12 ช้อนกินข้าว', point: 3 },
            ans3: { title: 'ประมาณ 6-9 ช้อนกินข้าว', point: 2 },
            ans4: { title: '1-5 ช้อนกินข้าว', point: 1 },
            ans5: { title: 'ไม่รับประทานเลย', point: 0 }
        },
        {
            id: 2,
            question: '2. วันนี้ท่านรับประทานอาหารประเภทเครื่องในสัตว์ ได้แก่ ตับหมู ตับไก่ ตับวัว ปริมาณเท่าไร',
            ans1: { title: 'มากกว่า 2 ช้อนกินข้าว', point: 4 },
            ans2: { title: 'ประมาณ 2 ช้อนกินข้าว', point: 3 },
            ans3: { title: '1 ช้อนกินข้าว', point: 2 },
            ans4: { title: 'รับประทานเล็กน้อย (ชิม)', point: 1 },
            ans5: { title: 'ไม่รับประทานเลย', point: 0 }
        },
        {
            id: 3,
            question: '3. วันนี้ท่านรับประทานผักใบเขียว ได้แก่ คะน้า ผักกูด ตำลึง บรอกโคลี กะหล่ำดาว มะเขือเทศ ปริมาณเท่าไร',
            ans1: { title: '4 ส่วนขึ้นไป (มากกว่า ผักสด 4 ถ้วยดิบ หรือผักสุก 2 ถ้วย)', point: 4 },
            ans2: { title: '3 ส่วน (≈ ผักสด 3 ถ้วยดิบ หรือผักสุก 1½ ถ้วย)', point: 3 },
            ans3: { title: '2 ส่วน (≈ ผักสด 2 ถ้วยดิบ หรือผักสุก 1 ถ้วย)', point: 2 },
            ans4: { title: 'ประมาณ 1 ส่วน (≈ ผักสด 1 ถ้วยดิบ หรือผักสุก ½ ถ้วย)', point: 1 },
            ans5: { title: 'ไม่ถึง ½ ส่วน (เช่น ชิมเล็กน้อย)', point: 0 }
        },
        {
            id: 4,
            question: '4. วันนี้ท่านรับประทานถั่วเมล็ดแห้งต่างๆ ที่ประกอบอาหารคาว หวาน ได้แก่ ถั่วแดง ถั่วเขียว ถั่วเหลือง ถั่วดำ ปริมาณเท่าไร',
            ans1: { title: '5 ช้อนชาขึ้นไป', point: 4 },
            ans2: { title: '3-4 ช้อนชา', point: 3 },
            ans3: { title: '1-2 ช้อนชา', point: 2 },
            ans4: { title: 'รับประทานเล็กน้อย (ชิม)', point: 1 },
            ans5: { title: 'ไม่รับประทานเลย', point: 0 }
        },
        {
            id: 5,
            question: '5. วันนี้ท่านรับประทานไข่ไก่กี่ฟอง',
            ans1: { title: '2 ฟองขึ้นไป', point: 4 },
            ans2: { title: '1 ฟอง', point: 3 },
            ans3: { title: 'ครึ่งฟอง หรือน้อยกว่า', point: 2 },
            ans4: { title: 'ชิมเล็กน้อย', point: 1 },
            ans5: { title: 'ไม่รับประทานเลย', point: 0 }
        },
        {
            id: 6,
            question: '6. วันนี้ท่านดื่มน้ำผลไม้ ได้แก่ น้ำส้ม น้ำฝรั่ง น้ำกระเจี๊ยบ น้ำมะนาว ปริมาณเท่าไร',
            ans1: { title: 'มากกว่า 2 แก้ว', point: 4 },
            ans2: { title: '2 แก้ว', point: 3 },
            ans3: { title: '1 แก้ว', point: 2 },
            ans4: { title: 'ครึ่งแก้วหรือน้อยกว่า', point: 1 },
            ans5: { title: 'ไม่ดื่มเลย', point: 0 }
        },
        {
            id: 7,
            question: '7. วันนี้ท่านรับประทานผลไม้ ได้แก่ ฝรั่ง มะขาม ส้ม สับปะรด มะม่วง ปริมาณเท่าไร',
            ans1: { title: '3/4 หรือ 4/4 ส่วน', point: 4 },
            ans2: { title: '2/4 ส่วน', point: 3 },
            ans3: { title: '1/4 ส่วน', point: 2 },
            ans4: { title: 'ชิมเล็กน้อย', point: 1 },
            ans5: { title: 'ไม่รับประทานเลย', point: 0 }
        },
        {
            id: 8,
            question: '8. วันนี้ท่านดื่มชา กาแฟ แตออ หลังรับประทานอาหารหรือไม่',
            ans1: { title: 'ไม่ดื่มเลย', point: 4 },
            ans2: { title: 'ดื่มน้อยกว่าครึ่งแก้ว', point: 3 },
            ans3: { title: 'ดื่ม 1 มื้อ', point: 2 },
            ans4: { title: 'ดื่ม 2 มื้อ', point: 1 },
            ans5: { title: 'ดื่มทุกมื้อ', point: 0 }
        },
        {
            id: 9,
            question: '9. วันนี้ท่านรับประทานอาหารที่ปรุงไม่สุก ได้แก่ ลาบ ก้อย และเนื้อสัตว์ที่ปรุงแบบไม่สุก หรือไม่',
            ans1: { title: 'รับประทานทุกมื้อ', point: 0 },
            ans2: { title: '3 มื้อ', point: 1 },
            ans3: { title: '2 มื้อ', point: 2 },
            ans4: { title: 'ชิมเล็กน้อย', point: 3 },
            ans5: { title: 'ไม่รับประทานเลย', point: 4 }
        },
        {
            id: 10,
            question: '10. วันนี้ท่านรับประทานยาเม็ดเสริมธาตุเหล็กตามที่แพทย์สั่งหรือไม่',
            ans1: { title: 'รับประทานตรงเวลา', point: 4 },
            ans2: { title: 'รับประทานเกือบตรงเวลา', point: 3 },
            ans3: { title: 'รับประทานล่าช้า', point: 2 },
            ans4: { title: 'ลืมบ้างบางครั้ง', point: 1 },
            ans5: { title: 'ไม่รับประทานเลย', point: 0 }
        },
        {
            id: 11,
            question: '11. วันนี้ท่านลืมรับประทานยาเม็ดเสริมธาตุเหล็ก หรือไม่',
            ans1: { title: 'ไม่ได้ทานเลย (ลืม 100%)', point: 0 },
            ans2: { title: 'ทานช้ามาก/ไม่ตรงเวลา (เลื่อนจนเกือบลืม)', point: 1 },
            ans3: { title: 'ลืมบ้าง (นึกได้หลังเลยเวลา แต่ยังได้ทาน)', point: 2 },
            ans4: { title: 'ทานตรงเวลา แต่เกือบลืม', point: 3 },
            ans5: { title: 'ทานตรงเวลา ไม่ลืม', point: 4 }
        },
        {
            id: 12,
            question: '12. วันนี้ท่านดื่มเครื่องดื่ม ได้แก่ ชา กาแฟ นม โอวัลติน หรือนมถั่วเหลือง พร้อมยาเม็ดเสริมธาตุเหล็ก หรือภายใน 1 ชั่วโมงหลังรับประทานยาเม็ดเสริมธาตุเหล็ก หรือไม่',
            ans1: { title: 'ไม่ดื่มเลย', point: 4 },
            ans2: { title: 'ดื่ม แต่เว้นห่างมากกว่า 2 ชั่วโมง ก่อน/หลังการกินยา', point: 3 },
            ans3: { title: 'ดื่มภายใน 2 ชั่วโมง หลังการกินยา', point: 2 },
            ans4: { title: 'ดื่มภายใน 1 ชั่วโมง หลังการกินยา', point: 1 },
            ans5: { title: 'ดื่มพร้อมกับการกินยาเม็ดเสริมธาตุเหล็ก', point: 0 }
        },
        {
            id: 13,
            question: '13. วันนี้ท่านรับประทานยาเม็ดเสริมธาตุเหล็กพร้อมผลไม้ที่มีรสเปรี้ยว หรือไม่',
            ans1: { title: 'รับประทานผลไม้รสเปรี้ยวพร้อมกับการกินยาเม็ดเสริมธาตุเหล็ก', point: 4 },
            ans2: { title: 'รับประทานผลไม้รสเปรี้ยวภายใน 2 ชั่วโมง หลังจากกินยา', point: 3 },
            ans3: { title: 'รับประทานผลไม้รสเปรี้ยว แต่เว้นห่างมากกว่า 2 ชั่วโมง หลังจากกินยา', point: 2 },
            ans4: { title: 'รับประทานผลไม้ แต่ไม่ใช่รสเปรี้ยว', point: 1 },
            ans5: { title: 'ไม่รับประทานผลไม้เลย', point: 0 }
        },
        {
            id: 14,
            question: '14. วันนี้ท่านหยุดรับประทานยาเม็ดเสริมธาตุเหล็กด้วยตนเอง เพราะเกิดอาการคลื่นไส้อาเจียนหรือท้องผูก หรือไม่',
            ans1: { title: 'รับประทานตามปกติ ไม่หยุดยา', point: 4 },
            ans2: { title: 'ไม่ได้ทานวันนี้ เพราะคลื่นไส้', point: 3 },
            ans3: { title: 'ไม่ได้ทานวันนี้ เพราะอาเจียน', point: 2 },
            ans4: { title: 'ไม่ได้ทานวันนี้ เพราะท้องผูก', point: 1 },
            ans5: { title: 'ไม่ได้ทานวันนี้ เพราะเหตุผลอื่น (เช่น ลืม ไม่สะดวก ไม่อยากกิน)', point: 0 }
        },
        {
            id: 15,
            question: '15. ท่านมาตรวจครรภ์ตามนัด หรือไม่',
            ans1: { title: 'มาตามนัด', point: 4 },
            ans2: { title: 'มาเล็กน้อยช้ากว่าเวลา', point: 3 },
            ans3: { title: 'เลื่อนนัดออกไป', point: 2 },
            ans4: { title: 'ยังไม่ได้มาตามนัด', point: 1 },
            ans5: { title: 'ไม่มาตามนัดเลย', point: 0 }
        },
        {
            id: 16,
            question: '16. วันนี้ท่านล้างผักและผลไม้ก่อนรับประทาน หรือไม่',
            ans1: { title: 'ล้างทุกครั้ง', point: 4 },
            ans2: { title: 'ล้างเกือบทุกครั้ง', point: 3 },
            ans3: { title: 'ล้างบางครั้ง', point: 2 },
            ans4: { title: 'ล้างเล็กน้อย', point: 1 },
            ans5: { title: 'ไม่ล้างเลย', point: 0 }
        },
        {
            id: 17,
            question: '17. วันนี้ท่านมีอาการท้องผูกบ่อยครั้ง ทำให้เป็นริดสีดวงทวาร หรือไม่',
            ans1: { title: 'มีทุกครั้ง', point: 0 },
            ans2: { title: 'มีบ่อยครั้ง', point: 1 },
            ans3: { title: 'มีบางครั้ง', point: 2 },
            ans4: { title: 'มีเล็กน้อย', point: 3 },
            ans5: { title: 'ไม่มีเลย', point: 4 }
        },
        {
            id: 18,
            question: '18. วันนี้ท่านดื่มน้ำสะอาดกี่แก้ว',
            ans1: { title: '8 แก้วขึ้นไป', point: 4 },
            ans2: { title: '6-7 แก้ว', point: 3 },
            ans3: { title: '4-5 แก้ว', point: 2 },
            ans4: { title: '1-3 แก้ว', point: 1 },
            ans5: { title: 'ไม่ดื่มเลย', point: 0 }
        },
        {
            id: 19,
            question: '19. วันนี้ท่านนอนหลับพักผ่อนกี่ชั่วโมง',
            ans1: { title: '9 ชั่วโมงขึ้นไป', point: 4 },
            ans2: { title: '7-8 ชั่วโมง', point: 3 },
            ans3: { title: '5-6 ชั่วโมง', point: 2 },
            ans4: { title: 'น้อยกว่า 5 ชั่วโมง', point: 1 },
            ans5: { title: 'ไม่นอนเลย', point: 0 }
        },
        {
            id: 20,
            question: '20. วันนี้ท่านสวมใส่รองเท้าก่อนออกจากบ้านทุกครั้ง',
            ans1: { title: 'สวมรองเท้าทุกครั้งที่ออกจากบ้าน', point: 3 },
            ans2: { title: 'สวมรองเท้าบ้าง แต่ก็มีหลายครั้งที่ไม่สวม', point: 2 },
            ans3: { title: 'สวมรองเท้าเพียงบางครั้ง', point: 1 },
            ans4: { title: 'ไม่สวมรองเท้าเลยเมื่อออกจากบ้าน', point: 0 }
        }
    ]


    const [answers, setAnswers] = useState({
        q1: { ans: '', point: 0 },
        q2: { ans: '', point: 0 },
        q3: { ans: '', point: 0 },
        q4: { ans: '', point: 0 },
        q5: { ans: '', point: 0 },
        q6: { ans: '', point: 0 },
        q7: { ans: '', point: 0 },
        q8: { ans: '', point: 0 },
        q9: { ans: '', point: 0 },
        q10: { ans: '', point: 0 },
        q11: { ans: '', point: 0 },
        q12: { ans: '', point: 0 },
        q13: { ans: '', point: 0 },
        q14: { ans: '', point: 0 },
        q15: { ans: '', point: 0 },
        q16: { ans: '', point: 0 },
        q17: { ans: '', point: 0 },
        q18: { ans: '', point: 0 },
        q19: { ans: '', point: 0 },
        q20: { ans: '', point: 0 },
    });

    const InsertBehave = () => {

        let decoded = localStorage.getItem("token")

        if (decoded) {
            let dat: any = jwtDecode(decoded)

            let allAnswers = Object.values(answers)

            let totalScore = allAnswers.reduce((total, item) => {
                return total = total + item.point
            }, 0)

            // console.log(dat)

            axios.post(`${url_endpoint}/behaveinfo`, {
                answers: JSON.stringify(answers),
                userId: dat.id,
                score: totalScore
            }).then((res) => {
                navigate.push("/takemed")
            })

        }
    }

    let init = () => {
        
        let token = localStorage.getItem("token")

        if (token) {
            let decoded: any = jwtDecode(token)

            setMe(decoded)

            axios.get(`${url_endpoint}/behave_detail/${decoded.id}`).then((res) => {
                console.log(res.data)
                setBehave(res.data.user)
            })
        }else{
            navigate.push("/")
        }
    }

    let fetchData=async()=>{
        setLoading(true)
        await init()
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    if(loading){
        return null
    }

    return (
        <div className="h-[100dvh] flex justify-center items-center flex-col">

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

            <p className="mb-3 w-80 text-center">แบบประเมินพฤติกรรมการดูแลตนเองเพื่อป้องกันภาวะโลหิตจาง สำหรับคุณแม่✨</p>

            {behave && behave.length > 0 ? <div className="flex flex-col">
                <p className="text-green-700">วันนี้คุณได้ทำแบบทดสอบพฤติกรรมแล้ว</p>
            </div> : <div className="flex flex-col justify-center items-center">
                <Progress className="w-80" value={progressCount}></Progress>
                <p className="mb-3 mt-3">{current < 10 ? "🔹  หมวดที่ 1: พฤติกรรมด้านโภชนาการ" : current < 15 ? "🔹หมวดที่ 2: พฤติกรรมด้านการรับประทานยา" : "🔹หมวดที่ 3: พฤติกรรมด้านการดูแลสุขภาพ"}</p>

                {quiz && quiz.length > 0 ? quiz.map((item, index) => {
                    return (
                        <Card key={index} className={`w-80 h-85 ${item.id != current ? 'hidden' : ''}`}>
                            <CardHeader>
                                <p>{item.question}</p>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup onValueChange={(e) => {


                                    let scored = Number(e.split('-')[1])

                                    setAnswers({
                                        ...answers,
                                        [`q${index + 1}`]: {
                                            ans: e,
                                            point: scored ? scored : 0
                                        }
                                    })
                                }}>
                                    <CustomRadio value={`${item.ans1.title}-${item.ans1.point}`} index={index}></CustomRadio>
                                    <CustomRadio value={`${item.ans2.title}-${item.ans2.point}`} index={index}></CustomRadio>
                                    <CustomRadio value={`${item.ans3.title}-${item.ans3.point}`} index={index}></CustomRadio>
                                    <CustomRadio value={`${item.ans4.title}-${item.ans4.point}`} index={index}></CustomRadio>
                                    {item.ans5 ? <CustomRadio value={`${item.ans5.title}-${item.ans5.point}`} index={index}></CustomRadio> : null}
                                </RadioGroup>
                            </CardContent>
                        </Card>
                    )
                }) : null}

                <div className="flex gap-3 mt-5 mb-5">
                    {current == 1 ? null : <Button className="cursor-pointer" onClick={() => {
                        if (current > 1) {
                            setCurrent(current - 1)
                            setProgressCount(progressCount - 5.263)
                        }
                    }}>กลับ</Button>}

                    <Button className="cursor-pointer" onClick={() => {
                        console.log(answers)
                        if (current < 20) {
                            setCurrent(current + 1)
                            setProgressCount(progressCount + 5.263)
                        }
                    }}>ถัดไป</Button>
                </div>


                {current == 20 ? <Button onClick={async () => {
                    let checkCompleted = await Object.values(answers).every(item => item.ans != '')

                    if (checkCompleted) {
                        toast.loading("กำลังบันทึกพฤติกรรม", { duration: 2000 })
                        setTimeout(() => {
                            InsertBehave()
                            toast.success("บันทึกสำเร็จ!", { duration: 2000 })
                        }, 2000)


                    } else {
                        toast.error("กรุณากรอกแบบสอบถามให้ครบทุกข้อ")
                    }
                }} className="w-80 absolute bottom-7">บันทึก</Button> : null}
            </div>}

            <Toaster position="bottom-center" />

        </div>
    )
}

export default Behave