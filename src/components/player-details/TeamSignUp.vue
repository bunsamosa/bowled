<script setup lang="ts">
import { ref } from "vue";
import 'vue-search-select/dist/VueSearchSelect.css';
import { ModelSelect } from 'vue-search-select';
</script>

<template>
    <div class="signup-page">
        <div>
            <p>Team Name</p>
            <input class="signup-input" placeholder="Team Name..." />
        </div>
        <div>
            <p>Manager Name</p>
            <input class="signup-input" placeholder="Manager Name..." />
        </div>
        <div>
            <p>Country</p>
            <select class="signup-input" name="country" id="country">
                <option value="">Country...</option>
                <option value="india">India</option>
                <option value="pak">Pakistan</option>
                <option value="sl">Sri Lanka</option>
                <option value="aus">Australia</option>
                <option value="nz">New Zealand</option>
                <option value="eng">England</option>
                <option value="sa">South Africa</option>
                <option value="wi">West Indies</option>
            </select>
        </div>
        <div class="btn">
            <button>Sign Up</button>
        </div>

    </div>
</template>

<style>
.signup-input {
    border: 2px solid rgb(0, 0, 0) !important;
    width: 45vw;
    border-radius: 10px;
    padding: 10px 0;
    color: white;
}

.signup-page {
    display: flex;
    flex-direction: column;
    background-color: rgb(183, 183, 183);
    margin: auto;
    width: 50%;
    padding: 50px 20px;
    border-radius: 15px;
    box-shadow: 5px 10px #888888;
}

.signup-page p {
    margin-top: 4%;
    margin-bottom: 1%;
    font-size: 20px;
    font-weight: 500;
}

.signup-page button {
    background-color: rgb(249, 221, 61);
    padding: 10px;
    width: 30vw;
    border-radius: 15px;
    color: rgb(32, 32, 32);
    font-weight: bolder;
    cursor: pointer;
}

.btn {
    margin-top: 30px;
}

.signup-input op

.signup-page button:hover {
    background-color: rgb(255, 204, 0);
}
</style>