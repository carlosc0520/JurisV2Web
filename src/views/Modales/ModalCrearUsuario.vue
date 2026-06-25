<template>
    <b-modal id="modalAgregarUsuario" v-model="isShow" @ok="submit" @cancel="close" @hidden="close" size="xl"
        ok-title="Guardar" cancel-title="Cancelar" bodyScrolling no-close-on-backdrop no-close-on-esc
        :hide-footer="loadingSubmit" modal-class="modern-modal">

        <template #title>
            <div class="flex items-center gap-3 text-lg font-semibold text-[#1A202C]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="url(#gradient)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="url(#gradient)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#DF2DB2;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                </svg>
                <span class="text-[#374151]">Generar Usuario</span>
            </div>
        </template>

        <form id="formAgregarUsuario" @submit.prevent="submit" class="modern-form">
            <div class="mb-7 p-5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] max-sm:p-4 max-sm:mb-5">
                <h6 class="flex items-center gap-2.5 text-[15px] font-semibold text-[#374151] mb-5 pb-3 border-b-2 border-[#E5E7EB] max-sm:text-sm max-sm:mb-4">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Información Personal
                </h6>
                <div class="row">
                    <div class="col-md-4 col-12 mb-3">
                        <label for="NOMBRES" class="block text-[13px] font-semibold text-[#374151] mb-2">
                            Nombres <span class="text-danger">*</span>
                        </label>
                        <div class="input-icon-wrapper relative w-full">
                            <svg class="input-icon absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-[1]" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <input type="text"
                                class="form-control-modern w-full py-3 pr-3 pl-11 text-sm text-[#1F2937] bg-white border-2 border-[#E5E7EB] rounded-[10px] transition-all duration-300 outline-none hover:border-[#D1D5DB] focus:border-[#D1D5DB]"
                                :class="{ 'is-invalid border-red-500 bg-red-50': validation.hasError('modelo.NOMBRES') }"
                                v-model="modelo.NOMBRES" id="NOMBRES" placeholder="Ingrese sus nombres" maxlength="100" />
                        </div>
                        <span class="error-animate flex items-center gap-1.5 mt-1.5 text-xs text-red-500 font-medium" v-if="validation.hasError('modelo.NOMBRES')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            {{ validation.firstError('modelo.NOMBRES') }}
                        </span>
                    </div>

                    <div class="col-md-4 col-12 mb-3">
                        <label for="APELLIDOP" class="block text-[13px] font-semibold text-[#374151] mb-2">
                            Apellido Paterno <span class="text-danger">*</span>
                        </label>
                        <div class="input-icon-wrapper relative w-full">
                            <svg class="input-icon absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-[1]" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <input type="text"
                                class="form-control-modern w-full py-3 pr-3 pl-11 text-sm text-[#1F2937] bg-white border-2 border-[#E5E7EB] rounded-[10px] transition-all duration-300 outline-none hover:border-[#D1D5DB] focus:border-[#D1D5DB]"
                                :class="{ 'is-invalid border-red-500 bg-red-50': validation.hasError('modelo.APELLIDOP') }"
                                v-model="modelo.APELLIDOP" id="APELLIDOP" placeholder="Ingrese apellido paterno" maxlength="50" />
                        </div>
                        <span class="error-animate flex items-center gap-1.5 mt-1.5 text-xs text-red-500 font-medium" v-if="validation.hasError('modelo.APELLIDOP')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            {{ validation.firstError('modelo.APELLIDOP') }}
                        </span>
                    </div>

                    <div class="col-md-4 col-12 mb-3">
                        <label for="APELLIDOM" class="block text-[13px] font-semibold text-[#374151] mb-2">
                            Apellido Materno <span class="text-danger">*</span>
                        </label>
                        <div class="input-icon-wrapper relative w-full">
                            <svg class="input-icon absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-[1]" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <input type="text"
                                class="form-control-modern w-full py-3 pr-3 pl-11 text-sm text-[#1F2937] bg-white border-2 border-[#E5E7EB] rounded-[10px] transition-all duration-300 outline-none hover:border-[#D1D5DB] focus:border-[#D1D5DB]"
                                :class="{ 'is-invalid border-red-500 bg-red-50': validation.hasError('modelo.APELLIDOM') }"
                                v-model="modelo.APELLIDOM" id="APELLIDOM" placeholder="Ingrese apellido materno" maxlength="50" />
                        </div>
                        <span class="error-animate flex items-center gap-1.5 mt-1.5 text-xs text-red-500 font-medium" v-if="validation.hasError('modelo.APELLIDOM')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            {{ validation.firstError('modelo.APELLIDOM') }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="mb-7 p-5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] max-sm:p-4 max-sm:mb-5">
                <h6 class="flex items-center gap-2.5 text-[15px] font-semibold text-[#374151] mb-5 pb-3 border-b-2 border-[#E5E7EB] max-sm:text-sm max-sm:mb-4">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Información de Contacto
                </h6>
                <div class="row">
                    <div class="col-md-6 col-12 mb-3">
                        <label for="CORREO" class="block text-[13px] font-semibold text-[#374151] mb-2">
                            Correo Electrónico <span class="text-danger">*</span>
                        </label>
                        <div class="input-icon-wrapper relative w-full">
                            <svg class="input-icon absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-[1]" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <input type="email"
                                class="form-control-modern w-full py-3 pr-3 pl-11 text-sm text-[#1F2937] bg-white border-2 border-[#E5E7EB] rounded-[10px] transition-all duration-300 outline-none hover:border-[#D1D5DB] focus:border-[#D1D5DB]"
                                :class="{ 'is-invalid border-red-500 bg-red-50': validation.hasError('modelo.CORREO') }"
                                v-model="modelo.CORREO" id="CORREO" placeholder="ejemplo@correo.com" maxlength="100" />
                        </div>
                        <span class="error-animate flex items-center gap-1.5 mt-1.5 text-xs text-red-500 font-medium" v-if="validation.hasError('modelo.CORREO')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            {{ validation.firstError('modelo.CORREO') }}
                        </span>
                    </div>

                    <div class="col-md-6 col-12 mb-3">
                        <label for="TELEFONO" class="block text-[13px] font-semibold text-[#374151] mb-2">
                            Nro. Celular <span class="text-danger">*</span>
                        </label>
                        <div class="input-icon-wrapper relative w-full">
                            <svg class="input-icon absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-[1]" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <vue-tel-input
                                v-model="modelo.TELEFONO"
                                id="TELEFONO"
                                inputmode="numeric"
                                @input="(e) => modelo.TELEFONO = e"
                                :inputOptions="{ placeholder: 'Ingrese número de celular' }"
                                :class="{ 'is-invalid': phoneError }"
                            ></vue-tel-input>
                        </div>
                        <span class="error-animate flex items-center gap-1.5 mt-1.5 text-xs text-red-500 font-medium" v-if="phoneError">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            {{ phoneError }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="mb-7 p-5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] max-sm:p-4 max-sm:mb-5">
                <h6 class="flex items-center gap-2.5 text-[15px] font-semibold text-[#374151] mb-5 pb-3 border-b-2 border-[#E5E7EB] max-sm:text-sm max-sm:mb-4">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Información Adicional
                </h6>
                <div class="row">
                    <div class="col-md-4 col-12 mb-3">
                        <label for="FNACIMIENTO" class="block text-[13px] font-semibold text-[#374151] mb-2">Fecha de Nacimiento</label>
                        <div class="input-icon-wrapper relative w-full">
                            <svg class="input-icon absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-[1]" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 2V5M16 2V5M3 9H21M5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <date-picker v-model="modelo.FNACIMIENTO" :value="modelo.FNACIMIENTO" valueType="format"
                                :disabledDate="time => time.getTime() > Date.now()"
                                @change="(date) => modelo.FNACIMIENTO = date"
                                placeholder="Seleccione fecha"
                                class="date-picker-modern"></date-picker>
                        </div>
                    </div>

                    <div class="col-md-4 col-12 mb-3">
                        <label for="PROFESION" class="block text-[13px] font-semibold text-[#374151] mb-2">Profesión</label>
                        <div class="input-icon-wrapper relative w-full">
                            <svg class="input-icon absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-[1]" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 16V8C20.9996 7.64927 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64927 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <input type="text"
                                v-model="modelo.PROFESION" id="PROFESION"
                                class="form-control-modern w-full py-3 pr-3 pl-11 text-sm text-[#1F2937] bg-white border-2 border-[#E5E7EB] rounded-[10px] transition-all duration-300 outline-none hover:border-[#D1D5DB] focus:border-[#D1D5DB]"
                                placeholder="Ej: Abogado" maxlength="100" />
                        </div>
                    </div>

                    <div class="col-md-4 col-12 mb-3">
                        <label for="CARGO" class="block text-[13px] font-semibold text-[#374151] mb-2">Cargo</label>
                        <div class="input-icon-wrapper relative w-full">
                            <svg class="input-icon absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-[1]" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <input type="text"
                                v-model="modelo.CARGO" id="CARGO"
                                class="form-control-modern w-full py-3 pr-3 pl-11 text-sm text-[#1F2937] bg-white border-2 border-[#E5E7EB] rounded-[10px] transition-all duration-300 outline-none hover:border-[#D1D5DB] focus:border-[#D1D5DB]"
                                placeholder="Ej: Gerente Legal" maxlength="100" />
                        </div>
                    </div>

                    <div class="col-12 mb-3">
                        <label for="DIRECCION" class="block text-[13px] font-semibold text-[#374151] mb-2">Dirección</label>
                        <div class="input-icon-wrapper relative w-full">
                            <svg class="input-icon absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-[1]" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <input type="text"
                                v-model="modelo.DIRECCION" id="DIRECCION"
                                class="form-control-modern w-full py-3 pr-3 pl-11 text-sm text-[#1F2937] bg-white border-2 border-[#E5E7EB] rounded-[10px] transition-all duration-300 outline-none hover:border-[#D1D5DB] focus:border-[#D1D5DB]"
                                placeholder="Ingrese su dirección completa" maxlength="200" />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </b-modal>
</template>


<script>
import { BModal } from 'bootstrap-vue-next';
import { Validator } from 'simple-vue-validator';
import { toast } from 'vue3-toastify';

import newUserProxy from "@/proxies/NewUserProxy";


export default {
    components: {
        BModal
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        close: {
            type: Function,
            default: () => { }
        },
        update: {
            type: Function,
            default: () => { }
        },
    },
    data() {
        return {
            isShow: false,
            loadingSubmit: false,
            phoneError: null,
            modelo: {
                NOMBRES: null,
                APELLIDOP: null,
                APELLIDOM: null,
                CORREO: null,
                TELEFONO: null,
                FNACIMIENTO: null,
                PROFESION: null,
                CARGO: null,
                DIRECCION: null,
            },
        }
    },
    validators: {
        'modelo.NOMBRES': function (value) {
            return Validator.value(value)
                .required("El nombre es requerido")
                .minLength(2, "El nombre debe tener al menos 2 caracteres")
                .maxLength(100, "El nombre no puede exceder 100 caracteres")
                .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras y espacios");
        },
        'modelo.APELLIDOP': function (value) {
            return Validator.value(value)
                .required("El apellido paterno es requerido")
                .minLength(2, "El apellido debe tener al menos 2 caracteres")
                .maxLength(50, "El apellido no puede exceder 50 caracteres")
                .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras y espacios");
        },
        'modelo.APELLIDOM': function (value) {
            return Validator.value(value)
                .required("El apellido materno es requerido")
                .minLength(2, "El apellido debe tener al menos 2 caracteres")
                .maxLength(50, "El apellido no puede exceder 50 caracteres")
                .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras y espacios");
        },
        'modelo.CORREO': function (value) {
            return Validator.value(value)
                .required("El correo electrónico es requerido")
                .email("Ingrese un correo electrónico válido")
                .maxLength(100, "El correo no puede exceder 100 caracteres");
        },
    },
    methods: {
        validatePhone() {
            this.phoneError = null;
            const phoneInput = document.querySelector('#TELEFONO input');

            if (!phoneInput) return false;

            const telefono = phoneInput.value.trim();

            if (!telefono) {
                this.phoneError = "El número de teléfono es requerido";
                return false;
            }

            const cleanPhone = telefono.replace(/[\s\-()]/g, '');

            if (!/^[\d+\s\-()]+$/.test(telefono)) {
                this.phoneError = "El teléfono solo puede contener números y símbolos +, -, (), espacios";
                return false;
            }

            if (cleanPhone.replace(/^\+\d{1,3}/, '').length < 7) {
                this.phoneError = "El número de teléfono debe tener al menos 7 dígitos";
                return false;
            }

            if (cleanPhone.length > 20) {
                this.phoneError = "El número de teléfono es demasiado largo";
                return false;
            }

            return true;
        },
        async submit(e) {
            e.preventDefault();

            let validate = await this.$validate();
            if (!validate) {
                toast.error("Por favor, corrija los errores en el formulario");
                return;
            }

            if (!this.validatePhone()) {
                return;
            }

            this.loadingSubmit = true;
            const loadingToast = toast.loading("Creando usuario...");

            await newUserProxy.solicitud(this.modelo)
                .then((response) => {
                    const toastMessage = response.STATUS ? "Revise su correo para la confirmación" : response.MESSAGE;
                    if (response.STATUS) {
                        toast.success(toastMessage, { autoClose: 5000 });
                        this.reset();
                        this.update();
                        this.close();
                    } else {
                        toast.error(toastMessage);
                    }
                })
                .catch((error) => toast.error(error?.MESSAGE || 'Error al crear el usuario'))
                .finally(() => {
                    toast.remove(loadingToast);
                    this.loadingSubmit = false;
                });
        },
        reset() {
            this.modelo = {
                NOMBRES: null,
                APELLIDOP: null,
                APELLIDOM: null,
                CORREO: null,
                TELEFONO: null,
                FNACIMIENTO: null,
                PROFESION: null,
                CARGO: null,
                DIRECCION: null,
            }

            this.phoneError = null;
            this.validation.reset();

            this.$nextTick(() => {
                const phoneInput = document.querySelector('#TELEFONO input');
                if (phoneInput) {
                    phoneInput.value = '';
                }
            });
        }
    },
    watch: {
        show: {
            handler(value) {
                this.reset();
                this.isShow = value;
            }
        },
        'modelo.TELEFONO': {
            handler() {
                if (this.phoneError) {
                    this.validatePhone();
                }
            }
        }
    }
}
</script>

<style scoped>
@keyframes slideDown {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
}
.error-animate { animation: slideDown 0.3s ease; }

.form-control-modern::placeholder { color: #9CA3AF; font-weight: 400; }
.form-control-modern.is-invalid:focus { border-color: #EF4444; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1); }

/* Vue Tel Input */
.input-icon-wrapper :deep(.vue-tel-input) {
    border: 2px solid #E5E7EB !important;
    border-radius: 10px !important;
    transition: all 0.3s ease;
    background: white !important;
    padding-left: 38px;
}
.input-icon-wrapper :deep(.vue-tel-input:focus-within) {
    border-color: #D1D5DB !important;
    box-shadow: none !important;
}
.input-icon-wrapper :deep(.vue-tel-input:hover) {
    border-color: #D1D5DB !important;
}
.input-icon-wrapper :deep(.vue-tel-input.is-invalid) {
    border-color: #EF4444 !important;
    background: #FEF2F2 !important;
}
.input-icon-wrapper :deep(.vti__input) {
    padding: 12px 12px 12px 8px !important;
    border: none !important;
    font-size: 14px;
    background: white !important;
    color: #1F2937 !important;
}
.input-icon-wrapper :deep(.vti__input:focus) {
    background: white !important;
    outline: none !important;
    box-shadow: none !important;
}
.input-icon-wrapper :deep(.vti__dropdown) {
    padding: 8px;
    background: white !important;
}
.input-icon-wrapper :deep(.vti__dropdown:hover) {
    background: #F9FAFB !important;
}

/* Date Picker */
.input-icon-wrapper :deep(.mx-datepicker) { width: 100%; }
.input-icon-wrapper :deep(.mx-input) {
    padding: 12px 12px 12px 44px !important;
    font-size: 14px;
    color: #1F2937;
    background: white;
    border: 2px solid #E5E7EB !important;
    border-radius: 10px !important;
    transition: all 0.3s ease;
    height: auto !important;
}
.input-icon-wrapper :deep(.mx-input:focus) {
    border-color: #D1D5DB !important;
    box-shadow: none !important;
}
.input-icon-wrapper :deep(.mx-input:hover) { border-color: #D1D5DB !important; }
.input-icon-wrapper :deep(.mx-input::placeholder) { color: #9CA3AF; }

/* Modal structure */
:deep(.modal-content) {
    border-radius: 16px;
    border: none;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}
:deep(.modal-header) { border-bottom: 2px solid #E5E7EB; padding: 20px 24px; }
:deep(.modal-body) { padding: 24px; }
:deep(.modal-footer) { border-top: 2px solid #E5E7EB; padding: 16px 24px; }
:deep(.btn-primary) {
    background: linear-gradient(135deg, #DF2DB2 0%, #8B5CF6 100%) !important;
    border: none !important;
    padding: 10px 24px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.3s ease;
}
:deep(.btn-primary:hover) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4); }
:deep(.btn-secondary) {
    background: white !important;
    border: 2px solid #E5E7EB !important;
    color: #6B7280 !important;
    padding: 10px 24px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.3s ease;
}
:deep(.btn-secondary:hover) { background: #F3F4F6 !important; border-color: #D1D5DB !important; }
</style>
