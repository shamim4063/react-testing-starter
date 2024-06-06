import SearchBox from "../components/SearchBox";

const PlaygroundPage = () => {
  return <SearchBox onChange={(text) => console.log(text)} />;
  // return <TermsAndConditions/>
  // return <Onboarding />;
  // return <ExpandableText text="The error suggests that the mock function for window.alert is not being called with the expected argument. Let's ensure that the mocking and assertion logic is set up correctly. We'll re-evaluate the test step-by-step to ensure all configurations and expectations are correctly aligned."/>
};

export default PlaygroundPage;
