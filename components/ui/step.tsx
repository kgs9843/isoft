import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

const useSteps = (initialStep: string = '') => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [stepsOrder, setStepsOrder] = useState<string[]>([]);

  const goNext = () => {
    const currentIndex = stepsOrder.indexOf(currentStep);
    if (currentIndex < stepsOrder.length - 1) {
      setCurrentStep(stepsOrder[currentIndex + 1]);
    }
  };

  const goPrev = () => {
    const currentIndex = stepsOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepsOrder[currentIndex - 1]);
    }
  };

  const setSteps = (steps: string[]) => {
    setStepsOrder(steps);
    if (!steps.includes(currentStep)) {
      setCurrentStep(steps[0] || '');
    }
  };

  return {
    currentStep,
    goNext,
    goPrev,
    setCurrentStep,
    setSteps,
  };
};

const StepsContext = createContext<TStepsContextProps | undefined>(undefined);

const StepsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const steps = useSteps();

  return (
    <StepsContext.Provider value={steps}>{children}</StepsContext.Provider>
  );
};

const useStepsContext = () => {
  const context = useContext(StepsContext);
  if (!context) {
    throw new Error('useStepsContext must be used within a StepsProvider');
  }
  return context;
};

const Step: React.FC<TStepProps> = ({
  value,
  title,
  description,
  children,
  complete,
  goPrev,
  goNext,
}) => {
  const {
    currentStep,
    goPrev: goPrevDefault,
    goNext: goNextDefault,
  } = useStepsContext();

  return currentStep === value ? (
    <View style={{ flex: 1 }} className="flex justify-between h-full py-4">
      <View style={{ flex: 1 }}>
        <View className="pb-2">
          <Text className="font-bold text-2xl mb-1">{title}</Text>
          <Text className="font-normal text-neutral-600">{description}</Text>
        </View>
        <ScrollView>{children}</ScrollView>
      </View>
      <View className="flex flex-row gap-x-2 items-center w-full">
        <Button
          variant="secondary"
          className="flex-1"
          onPress={goPrev ?? goPrevDefault}
        >
          <Text>이전</Text>
        </Button>
        <Button
          variant="default"
          className="flex-1"
          onPress={goNext ?? goNextDefault}
          disabled={!complete}
        >
          <Text>다음</Text>
        </Button>
      </View>
    </View>
  ) : null;
};

const Steps: React.FC<TStepsProps> = ({ steps, children }) => {
  const { setSteps } = useStepsContext();

  useEffect(() => {
    setSteps(Object.keys(steps));
  }, [Object.keys(steps).join(',')]);

  return (
    <>
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          const stepProps = steps[child.props.value] || {};
          return cloneElement(child, { ...stepProps });
        }
        return child;
      })}
    </>
  );
};

type TStepsContextProps = {
  currentStep: string;
  goNext: () => void;
  goPrev: () => void;
  setCurrentStep: (step: string) => void;
  setSteps: (steps: string[]) => void;
};

type TStepProps = {
  value: string;
  title: string;
  description: string;
  complete?: boolean;
  goNext?: () => void;
  goPrev?: () => void;
} & PropsWithChildren;

type TStepsProps = {
  steps: { [key: string]: { complete: boolean } };
} & PropsWithChildren;

export { Steps, Step, StepsProvider, useStepsContext };
export type { TStepsContextProps };
