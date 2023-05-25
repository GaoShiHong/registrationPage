import { createSignal } from 'solid-js';
import { mergeProps } from "solid-js";
import type { Component } from "solid-js";
import { splitProps } from "solid-js";
import "./Model.css"

interface ModelProps {
    title: string;
    buttonShow: boolean;
}

export function Model(props: any) {
    return (
        <div>
            <div class='model'>
                <div class='model-back'></div>
                <div class='model-content'>
                    <div class='model-content-title'>{props.title}</div>
                    <div class='model-content-body'>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    )
}