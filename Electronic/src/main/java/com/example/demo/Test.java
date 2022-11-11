package com.example.demo;

import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

public class Test {

	public static void main(String[] args) {
		String str ="ashish";
		Map<Object, Long> values= Arrays.stream(str.split("")).map(String:: toLowerCase).collect(Collectors.groupingBy(n->n,LinkedHashMap::new,Collectors.counting()));
		System.out.println(values);
		
		Student s1=new Student();
		s1.name="ashish";
		
		Student s2=new Student();
		s2.name="ashish";
		
		HashMap<Student, String> students=new HashMap<>();
		students.put(s1, "1st");
		students.put(s2, "2nd");
		System.out.println(s1==s2);
	}

}
class Student{
	
	String name;
	

}