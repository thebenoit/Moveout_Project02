<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const sessionId = ref(null);
const verifying = ref(true);
const paymentVerified = ref(false);
const error = ref(null);

onMounted(async () => {
  // Get session ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  sessionId.value = urlParams.get("session_id");

  if (!sessionId.value) {
    error.value = "No payment session found";
    verifying.value = false;
    return;
  }

  // Verify payment status
  try {
    const response = await fetch(
      `${import.meta.env.VITE_NODE_SERVER_URL}/api/early-access/verify/${sessionId.value}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();

    if (data.paid || data.paymentStatus === "paid") {
      paymentVerified.value = true;
    } else {
      error.value = "Payment verification pending. Please check your email.";
    }
  } catch (err) {
    console.error("Verification error:", err);
    error.value = "Unable to verify payment. Please check your email for confirmation.";
  } finally {
    verifying.value = false;
  }
});

function goHome() {
  router.push("/");
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
      <!-- Loading State -->
      <div v-if="verifying" class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-6"></div>
        <h2 class="text-2xl font-semibold text-gray-800 mb-2">Verifying your payment...</h2>
        <p class="text-gray-600">Please wait a moment</p>
      </div>

      <!-- Success State -->
      <div v-else-if="paymentVerified" class="text-center">
        <!-- Success Icon -->
        <div class="mb-6">
          <svg class="mx-auto h-20 w-20 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>

        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          🎉 Welcome to Early Access!
        </h1>

        <p class="text-xl text-gray-700 mb-6">
          Payment successful! You're officially part of our exclusive early access group.
        </p>

        <div class="bg-indigo-50 border-l-4 border-indigo-500 p-6 mb-8 text-left">
          <h3 class="font-semibold text-indigo-900 mb-3 text-lg">What happens next?</h3>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start">
              <span class="text-indigo-600 mr-2">✓</span>
              <span><strong>Email confirmation:</strong> Check your inbox for payment receipt and welcome email with your login credentials</span>
            </li>
            <li class="flex items-start">
              <span class="text-indigo-600 mr-2">✓</span>
              <span><strong>Launch date:</strong> Full platform access on <strong>January 20th, 2026</strong></span>
            </li>
            <li class="flex items-start">
              <span class="text-indigo-600 mr-2">✓</span>
              <span><strong>Early access perks:</strong> Priority support, exclusive features, and discounted pricing</span>
            </li>
            <li class="flex items-start">
              <span class="text-indigo-600 mr-2">✓</span>
              <span><strong>Updates:</strong> We'll email you as we get closer to launch with exciting updates</span>
            </li>
          </ul>
        </div>

        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-left">
          <p class="text-sm text-yellow-800">
            <strong>📧 Didn't receive an email?</strong> Check your spam folder or contact support at
            <b>438-523-9294</b> or kemmywillbenoit@yahoo.com
          </p>
        </div>

        <button
          @click="goHome"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-200 transform hover:scale-105"
        >
          Return to Homepage
        </button>
      </div>

      <!-- Error State -->
      <div v-else class="text-center">
        <div class="mb-6">
          <svg class="mx-auto h-20 w-20 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>

        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Payment Verification Pending</h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>

        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 text-left">
          <p class="text-sm text-blue-800">
            <strong>Don't worry!</strong> Your payment is being processed. You should receive a confirmation email within a few minutes.
            If you have any concerns, please contact us at
            <br>
            <b>438-523-9294</b> or <b>kemmywillbenoit@yahoo.com</b>
          </p>
        </div>

        <button
          @click="goHome"
          class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-200"
        >
          Return to Homepage
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles if needed */
</style>
