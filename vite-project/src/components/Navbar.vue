<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Logo from "./Logo.vue";
import MoveoutLogo from "../assets/images/MoveoutLogo.svg";
</script>

<template>
     <header class="navbar sticky top-0 z-50 justify-center h-1">
      <div>
        <!-- <a class="btn btn-ghost text-xl">daisyUI</a> -->
        <div class="cursor-pointer no-underline text-2xl flex items-center hover:shadow-2xl rounded-full w-[70px] transition-all duration-500 " @click="action">
          <img class="" :src=MoveoutLogo alt="logo"/>
        </div>
      </div>
      <div>
        <ul class="menu menu-horizontal px-1">
          <li><a>Link</a></li>
        </ul>
      </div>
      <div>
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img alt="Tailwind CSS Navbar component" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </div>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <a class="justify-between">
                Profile
                <span class="badge">New</span>
              </a>
            </li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
     </header>

    <!-- <div class="navbar sticky top-0 w-full h-1 backdrop-blur-2xl justify-center">
      <div>
        <a class="btn btn-ghost text-xl">daisyUI</a>
        <div class="cursor-pointer no-underline text-2xl flex items-center hover:shadow-2xl rounded-full transition-all duration-500 " @click="action">
          <img class="w-[90px]" :src=MoveoutLogo alt="logo"/>
        </div>
      </div>
      <div>

        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img alt="Tailwind CSS Navbar component" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </div>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <a class="justify-between">
                Profile
                <span class="badge">New</span>
              </a>
            </li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
      <div class="flex-none">
    <ul class="menu menu-horizontal px-1">
      <li><a>Link</a></li>
      <li>
        <details>
          <summary>
            Parent
          </summary>
          <ul class="p-2 bg-base-100 rounded-t-none">
            <li><a>Link 1</a></li>
            <li><a>Link 2</a></li>
          </ul>
        </details>
      </li>
    </ul>
  </div>
    </div> -->
</template>
