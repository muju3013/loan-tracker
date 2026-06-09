
import CountUp from 'react-countup';

export function CountUpNumber({ value, prefix = "", suffix = "", decimals = 0 }: { value: number, prefix?: string, suffix?: string, decimals?: number }) {
  return (
    <CountUp
      end={value}
      prefix={prefix}
      suffix={suffix}
      decimals={decimals}
      duration={2}
      separator=","
      useEasing={true}
    />
  );
}
