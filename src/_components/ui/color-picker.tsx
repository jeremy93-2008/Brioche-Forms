import { Button } from '@/_components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/_components/ui/dialog'
import { cn } from '@/_utils/clsx-tw'
import { Paintbrush } from 'lucide-react'
import { default as ColorPickerContent } from 'react-best-gradient-color-picker'

interface IColorPickerProps {
    background: string
    setBackground: (background: string) => void
    className?: string
}

function ColorPicker(props: IColorPickerProps) {
    const { background, setBackground, className } = props

    const solids = [
        '#E2E2E2',
        '#ff75c3',
        '#ffa647',
        '#ffe83f',
        '#9fff5b',
        '#70e2ff',
        '#cd93ff',
        '#09203f',
        '#537895',
        '#AC32E4',
        '#7918F2',
        '#4801FF',
        '#f953c6',
        '#b91d73',
        '#ee0979',
        '#ff6a00',
        '#F00000',
        '#DC281E',
        '#00c6ff',
    ]

    const gradients = [
        'linear-gradient(to top left,#accbee,#e7f0fd)',
        'linear-gradient(to top left,#d5d4d0,#d5d4d0,#eeeeec)',
        'linear-gradient(to top left,#000000,#434343)',
        'linear-gradient(to top left,#09203f,#537895)',
        'linear-gradient(to top left,#AC32E4,#7918F2,#4801FF)',
        'linear-gradient(to top left,#f953c6,#b91d73)',
        'linear-gradient(to top left,#ee0979,#ff6a00)',
        'linear-gradient(to top left,#F00000,#DC281E)',
        'linear-gradient(to top left,#00c6ff,#0072ff)',
        'linear-gradient(to top left,#4facfe,#00f2fe)',
        'linear-gradient(to top left,#0ba360,#3cba92)',
        'linear-gradient(to top left,#FDFC47,#24FE41)',
        'linear-gradient(to top left,#8a2be2,#0000cd,#228b22,#ccff00)',
        'linear-gradient(to top left,#40E0D0,#FF8C00,#FF0080)',
        'linear-gradient(to top left,#fcc5e4,#fda34b,#ff7882,#c8699e,#7046aa,#0c1db8,#020f75)',
        'linear-gradient(to top left,#ff75c3,#ffa647,#ffe83f,#9fff5b,#70e2ff,#cd93ff)',
        'linear-gradient(to top left,#E2E2E2,#ff75c3,#ffa647,#ffe83f,#9fff5b,#70e2ff,#cd93ff)',
        'linear-gradient(to top left,#e0eafc,#cfdef3)',
    ]
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                        'flex justify-start text-left font-normal',
                        !background && 'text-muted-foreground',
                        className
                    )}
                >
                    <div className="flex items-center gap-2">
                        {background ? (
                            <div
                                className="h-4 w-[232px] rounded bg-center! bg-cover! transition-all"
                                style={{ background }}
                            ></div>
                        ) : (
                            <Paintbrush className="h-4 w-4" />
                        )}
                        {!background && (
                            <div className="truncate w-[174px] flex-1">
                                Selecciona un color
                            </div>
                        )}
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[420px] p-5 gap-1">
                <DialogHeader className="mb-3">
                    <DialogTitle className="text-lg font-semibold">
                        Selecciona un color de fondo
                    </DialogTitle>
                </DialogHeader>
                <ColorPickerContent
                    value={background}
                    onChange={setBackground}
                    width={380}
                    height={200}
                    locales={{
                        CONTROLS: {
                            SOLID: 'Sólido',
                            GRADIENT: 'Gradiente',
                        },
                    }}
                    hidePresets={true}
                    style={{
                        body: {
                            backgroundColor: 'transparent',
                        },
                        rbgcpControlBtnWrapper: {
                            backgroundColor: 'var(--card)',
                        },
                        rbgcpControlBtnSelected: {
                            backgroundColor: 'var(--primary)',
                            color: 'var(--primary-foreground)',
                        },
                        rbgcpInput: {
                            backgroundColor: 'var(--card)',
                        },
                    }}
                />
                <span className="text-xs mt-4 mb-2">
                    Colores Preestablecidos
                </span>
                <section className="presets flex flex-row gap-2">
                    {background ? (
                        <div
                            className="flex min-w-12 min-h-12 w-12 h-12 rounded-lg"
                            style={{ background }}
                        />
                    ) : (
                        <div
                            key="none"
                            className="min-w-12 min-h-12 w-12 h-12 rounded-lg bg-muted"
                        >
                            <div
                                className="w-[2px] h-[3.84rem] bg-red-600 rounded-4xl"
                                style={{
                                    transform:
                                        'rotate(-45deg) translate(21px, 12px)',
                                }}
                            ></div>
                        </div>
                    )}
                    <div className="flex flex-row flex-wrap gap-1">
                        <div
                            key="none"
                            className="w-6 h-6 rounded-lg bg-muted cursor-pointer"
                            onClick={() => setBackground('')}
                        >
                            <div
                                className="w-px h-[1.8rem] bg-red-600 rounded-4xl"
                                style={{
                                    transform:
                                        'rotate(-45deg) translate(10px,6px)',
                                }}
                            ></div>
                        </div>
                        {solids.map((color) => (
                            <div
                                key={color}
                                className="w-6 h-6 rounded-lg cursor-pointer"
                                style={{ background: color }}
                                onClick={() => setBackground(color)}
                            />
                        ))}
                        {gradients.map((gradient) => (
                            <div
                                key={gradient}
                                className="w-6 h-6 rounded-lg cursor-pointer"
                                style={{ background: gradient }}
                                onClick={() => setBackground(gradient)}
                            />
                        ))}
                    </div>
                </section>
            </DialogContent>
        </Dialog>
    )
}

export { ColorPicker }
