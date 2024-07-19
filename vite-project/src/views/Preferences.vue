<script setup>
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import utils from '../utils/utils'
import { useRouter } from 'vue-router'
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/vue/24/outline'

const cardTitles = {
  "step1":{
    "title": "What are you looking for ?",
    "description": "What kind of appartment are you looking for ?"
  }, 
  "step2":{
    "title": "Additional Preferences",
    "description": "Furnished ? Parking ? public transport ?"
  }, 
  "step3":{
    "title": "Lifestyle Preferences",
    "description": "Animals ? Roomates ? Smoking ?"
  }, 
  "step4":{
    "title": "Tell Us About Yourself",
    "description": ""
  }, 
  "step5":{
    "title": "Final details",
    "description": ""
  }, 
}

</script>

<template>
  <div class="hero overflow-hidden min-h-screen flex justify-around w-full">
    <div class="w-full min-h-screen grid">
      <div class="mx-auto max-w-3/4 content-center">
        <Card class="bg-gray-200 backdrop-blur-3xl mt-16">
          <CardHeader>
            <CardTitle class="text-xl text-center">
              {{ cardTitles.step1.title }}
            </CardTitle>
            <CardDescription class="text-center">
              {{ cardTitles.step1.description }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="gap-4 flex">

              <div>
                <div class="flex h-full w-16">
                  <ArrowLeftCircleIcon class="hover:cursor-pointer m-auto align-middle stroke-gray-400 hover:stroke-cyan-500 transition-all duration-300" />
                </div>
              </div>
              <!-- What are you looking for ?
              Additional Preferences
              Lifestyle Preferences
              Tell Us About Yourself
              Final details -->
              <div class="w-full">
                <div class="grid mt-2">
                  <Input class="input" id="email" placeholder="Email or Phone Number" v-model="identifier" required />
                </div>
                <div class="grid mt-2">
                  <Input class="input" id="password" type="text" placeholder="Password" v-model="password" required />
                </div>
                <div class="grid mt-2">
                  <Input class="input" id="password" type="text" placeholder="Password" v-model="password" required />
                </div>
                <div class="grid mt-2">
                  <Input class="input" id="password" type="text" placeholder="Password" v-model="password" required />
                </div>
                <div class="grid mt-2">
                  <Input class="input" id="password" type="text" placeholder="Password" v-model="password" required />
                </div>
                <div class="grid mt-2">
                  <Input class="input" id="password" type="text" placeholder="Password" v-model="password" required />
                </div>
                <div class="grid mt-2">
                  <Input class="input" id="password" type="text" placeholder="Password" v-model="password" required />
                </div>
              </div>

              <div>
                <div class="flex h-full w-16">
                  <ArrowRightCircleIcon class="hover:cursor-pointer m-auto align-middle stroke-gray-400 hover:stroke-cyan-500 transition-all duration-300" />
                </div>
              </div>

            </div>
            <div class="w-full mt-10">
              <ul class="steps justify-around">
                <li class="step step-primary">Register</li>
                <li class="step step-primary">Choose plan</li>
                <li class="step step-primary">Purchase</li>
                <li class="step step-primary">Purchase</li>
                <li class="step step-primary">Purchase</li>
                
              </ul>
            </div>



          </CardContent>
        </Card>

        <!-- <div class="card w-96 shadow-xl bg-gray-300 p-8 items-center">
        <div class="text-2xl">
          Login
        </div>
        <div class="text-s">
          Fill the form below to get you started !
        </div>
        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-3 w-full">
            <input type="text" placeholder="First name" class="input input-bordered w-full max-w-xs" />
            <input type="text" placeholder="Last name" class="input input-bordered w-full max-w-xs" />
          </div>
          <input type="text" placeholder="Phone number" class="input input-bordered w-full max-w-xs" />
          <input type="text" placeholder="Email/Phone" class="input input-bordered w-full max-w-xs" />
          <input type="text" placeholder="Password" class="input input-bordered w-full max-w-xs" />
        </div>
      </div> -->
      </div>

    </div>

  </div>
</template>