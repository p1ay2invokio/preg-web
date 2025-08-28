'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { url_endpoint } from "@/config";
import Liff, { liff } from '@line/liff'
import { jwtDecode } from "jwt-decode";

export default function Home() {

  let navigate = useRouter()

  let [lineProfile, setLineProfile] = useState(null)
  let [loading, setLoading] = useState(true)

  let [personal, setPersonal] = useState({
    name: '',
    age: '',
    job: '',
    graduation: '',
    income: '',
    genre: '',
    marry: '',
    pregage: '',
    preghis: '',
    abort: '',
    line_userId: ''
  })


  const insertData = () => {
    axios.post(`${url_endpoint}/personal_info`, {
      ...personal
    }).then((res) => {
      console.log(res.data)
      if (res.data.status == 200) {
        if (res.data.message) {
          toast.error(res.data.message)
        } else {
          localStorage.setItem('token', res.data.token)

          toast.loading("กำลังตรวจสอบข้อมูลก่อนบันทึก", { duration: 1500 })

          setTimeout(() => {
            toast.success("บันทึกสำเร็จ")
            navigate.push("/takemed")
          }, 1500)
        }
      }
    })
  }



  const loginLine = async () => {
    await Liff.init({ liffId: '2008005445-ZEXLAlbB' })

    if (!Liff.isLoggedIn()) {
      Liff.login()
    } else {
      const userId: any = await Liff.getProfile()
      setLineProfile(userId)

      axios.get(`${url_endpoint}/personal_detail/${userId.userId}`).then((res) => {
        console.log("Come")
        console.log(res.data)
        if (res.data.token) {
          localStorage.setItem('token', res.data.token)
          navigate.push('/takemed')
        }
      })

      setPersonal({
        ...personal,
        line_userId: userId.userId
      })
      console.log(userId)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    await loginLine()
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])


  if (loading) {
    return null
  }

  // let [job, setJob] = useState({})

  return (
    <div className="flex justify-center items-center h-[100dvh] flex-col p-10">

      <p className="mb-5 text-center">แบบสอบถามข้อมูลส่วนบุคคลของหญิงตั้งครรภ์ในการป้องกันภาวะโลหิตจาง</p>
      <div className="grid grid-cols-2 gap-3">
        <Input onChange={(e) => {
          setPersonal({
            ...personal,
            name: e.target.value
          })
        }} className="w-full col-span-2" placeholder="ชื่อ-นามสกุล"></Input>
        <Input onChange={(e) => {
          setPersonal({
            ...personal,
            age: e.target.value
          })
        }} className="w-full col-span-2" placeholder="อายุ"></Input>
        <Select onValueChange={(e) => {
          setPersonal({
            ...personal,
            job: e
          })
        }}>
          <SelectTrigger className="w-[100%]">
            <SelectValue placeholder="อาชีพ"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="แม่บ้าน">แม่บ้าน</SelectItem>
            <SelectItem value="รับราชการ/พนักงานราชการ">รับราชการ/พนักงานราชการ</SelectItem>
            <SelectItem value="ค้าขาย/ธุรกิจ">ค้าขาย/ธุรกิจ</SelectItem>
            <SelectItem value="นักเรียน/นักศึกษา">นักเรียน/นักศึกษา</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(e) => {
          setPersonal({
            ...personal,
            graduation: e
          })
        }}>
          <SelectTrigger className="w-[100%]">
            <SelectValue placeholder="ระดับการศึกษา"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="แม่บ้าน">แม่บ้าน</SelectItem>
            <SelectItem value="ประถมศึกษา">ประถมศึกษา</SelectItem>
            <SelectItem value="มัธยมศึกษา">มัธยมศึกษา</SelectItem>
            <SelectItem value="ประกาศนียบัตร">ประกาศนียบัตร</SelectItem>
            <SelectItem value="ปริญญาตรี">ปริญญาตรี</SelectItem>
            <SelectItem value="สูงกว่าปริญญาตรี">สูงกว่าปริญญาตรี</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(e) => {
          setPersonal({
            ...personal,
            income: e
          })
        }}>
          <SelectTrigger className="w-[100%]">
            <SelectValue placeholder="รายได้ของครอบครัว (บาท/เดือน)"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-10,000 บาท/เดือน">0-10,000 บาท/เดือน</SelectItem>
            <SelectItem value="10,001-20,000 บาท/เดือน">10,001-20,000 บาท/เดือน</SelectItem>
            <SelectItem value="20,001-30,000 บาท/เดือน">20,001-30,000 บาท/เดือน</SelectItem>
            <SelectItem value="30,001 บาทขึ้นไป">30,001 บาทขึ้นไป</SelectItem>
          </SelectContent>
        </Select>


        <Select onValueChange={(e) => {
          setPersonal({
            ...personal,
            genre: e
          })
        }}>
          <SelectTrigger className="w-[100%]">
            <SelectValue placeholder="ลักษณะครอบครัว"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ครอบครัวเดี่ยว (บิดา มารดาและบุตร)">ครอบครัวเดี่ยว (บิดา มารดาและบุตร)</SelectItem>
            <SelectItem value="ครอบครัวขยาย (บิดา มารดา บุตรและญาติอื่นๆ)">ครอบครัวขยาย (บิดา มารดา บุตรและญาติอื่นๆ)</SelectItem>
          </SelectContent>
        </Select>


        <Select onValueChange={(e) => {
          setPersonal({
            ...personal,
            marry: e
          })
        }}>
          <SelectTrigger className="w-[100%]">
            <SelectValue placeholder="สถานภาพการสมรส"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="สมรส">สมรส</SelectItem>
            <SelectItem value="หย่าร้าง">หย่าร้าง</SelectItem>
            <SelectItem value="หม้าย">หม้าย</SelectItem>
            <SelectItem value="แยกกันอยู่">แยกกันอยู่</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(e) => {
          setPersonal({
            ...personal,
            pregage: e
          })
        }}>
          <SelectTrigger className="w-[100%]">
            <SelectValue placeholder="อายุครรภ์"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="น้อยกว่าหรือเท่ากับ 12+6 สัปดาห์">น้อยกว่าหรือเท่ากับ 12+6 สัปดาห์</SelectItem>
            <SelectItem value="13 สัปดาห์–27+6 สัปดาห์">13 สัปดาห์–27+6 สัปดาห์</SelectItem>
            <SelectItem value="28 สัปดาห์ขึ้นไป">28 สัปดาห์ขึ้นไป</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(e) => {
          setPersonal({
            ...personal,
            preghis: e
          })
        }}>
          <SelectTrigger className="w-[100%]">
            <SelectValue placeholder="ประวัติการตั้งครรภ์"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ตั้งครรภ์ครั้งแรก">ตั้งครรภ์ครั้งแรก</SelectItem>
            <SelectItem value="ครรภ์ที่ 2 ขึ้นไป">ครรภ์ที่ 2 ขึ้นไป</SelectItem>
          </SelectContent>
        </Select>


        <Select onValueChange={(e) => {
          setPersonal({
            ...personal,
            abort: e
          })
        }}>
          <SelectTrigger className="w-[100%]">
            <SelectValue placeholder="มีประวัติการแท้งบุตร"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ตั้งครรภ์ครั้งแรก">มี</SelectItem>
            <SelectItem value="ครรภ์ที่ 2 ขึ้นไป">ไม่มี</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={async () => {
          let isCompleted = Object.values(personal).every(value => value != '')
          console.log(isCompleted)
          if (isCompleted) {
            // Collect Data to db

            insertData()

            // navigate.push("/behave")
          } else {
            console.log(personal)
            toast.error("กรุณากรอกข้อมูลให้ครบถ้วน!")
          }
        }} className="col-span-2">บันทึกข้อมูล</Button>
      </div>

      <Toaster position="bottom-center" />
    </div>
  );
}
